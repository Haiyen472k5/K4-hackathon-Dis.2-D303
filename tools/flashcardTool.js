const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const { askAI, askAIServer, getServerContext } = require('./aiTool');
const { fetchAndExtractText, extractTextFromBuffer } = require('./documentTool');
const fs = require('fs');
const path = require('path');

/**
 * Phân tích nội dung AI trả về thành danh sách object Flashcard { front, back }
 */
function parseFlashcardsToData(text) {
    if (!text) return [];

    // 1. Thử parse JSON nếu AI trả về JSON array
    const jsonMatch = text.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (jsonMatch) {
        try {
            const parsed = JSON.parse(jsonMatch[0]);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed.map(c => ({
                    front: c.front || c.question || c.mat_truoc || 'Mặt trước',
                    back: c.back || c.answer || c.mat_sau || 'Mặt sau'
                }));
            }
        } catch (e) {}
    }

    // 2. Parse theo Regex Thẻ / Mặt trước / Mặt sau
    const cards = [];
    const cardBlocks = text.split(/(?:🎴|\*\*Thẻ\s*\d+:?\*\*|Thẻ\s*\d+:?)/gi);

    for (const block of cardBlocks) {
        if (!block || !block.trim()) continue;
        
        let front = '';
        let back = '';

        const frontMatch = block.match(/(?:Mặt trước|Khái niệm|Câu hỏi|\❓)[\s\:\*\-\_]*([^\n\r\💡\-\*]+)/i);
        const backMatch = block.match(/(?:Mặt sau|Giải thích|Đáp án|\💡)[\s\:\*\-\_]*([\s\S]+)/i);

        if (frontMatch) front = frontMatch[1].replace(/^[\:\*\-\_]+/, '').trim();
        if (backMatch) back = backMatch[1].replace(/^[\:\*\-\_]+/, '').trim();

        if (front || back) {
            cards.push({
                front: front || block.substring(0, 150).trim(),
                back: back || 'Bấm nút Lật Thẻ để xem giải thích chi tiết.'
            });
        }
    }

    if (cards.length > 0) return cards;

    // 3. Fallback: Nếu không parse được, tự tách các dòng
    const lines = text.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('📇') && !l.startsWith('*'));
    for (let i = 0; i < lines.length; i += 2) {
        cards.push({
            front: lines[i] || 'Khái niệm học tập',
            back: lines[i + 1] || lines[i] || 'Chi tiết nội dung'
        });
    }

    return cards.length > 0 ? cards : [
        { front: 'Khái niệm Flashcard', back: text.substring(0, 1000) }
    ];
}

/**
 * Gửi và quản lý bộ Flashcard tương tác Lật Thẻ bằng Button trên Discord
 */
async function sendInteractiveFlashcards(target, cards, topicName = 'Tài liệu') {
    if (!cards || cards.length === 0) {
        const errorMsg = '❌ Không thể phân tích bộ Flashcards!';
        if (target.edit) return await target.edit(errorMsg);
        if (target.editReply) return await target.editReply(errorMsg);
        return await target.reply(errorMsg);
    }

    let currentIndex = 0;
    let isFlipped = false; // false = Mặt trước, true = Mặt sau

    function buildEmbed() {
        const total = cards.length;
        const currentCard = cards[currentIndex];

        const embed = new EmbedBuilder().setTimestamp();

        if (!isFlipped) {
            // MẶT TRƯỚC (CÂU HỎI / KHÁI NIỆM)
            embed
                .setColor(0x5865F2) // Discord Blurple
                .setTitle(`🃏 FLASHCARD [Thẻ ${currentIndex + 1}/${total}] — MẶT TRƯỚC`)
                .setDescription(`❓ **Khái niệm / Câu hỏi:**\n\n>>> **${currentCard.front}**`)
                .setFooter({ text: `💡 Bấm nút [🔄 Lật xem Đáp án] để xem mặt sau!` });
        } else {
            // MẶT SAU (GIẢI THÍCH / ĐÁP ÁN)
            embed
                .setColor(0x57F287) // Green
                .setTitle(`💡 FLASHCARD [Thẻ ${currentIndex + 1}/${total}] — MẶT SAU`)
                .setDescription(`✅ **Giải thích / Đáp án:**\n\n>>> **${currentCard.back}**`)
                .setFooter({ text: `↩️ Bấm nút [↩️ Lật lại Mặt trước] để quay lại!` });
        }

        return embed;
    }

    function buildButtons() {
        const total = cards.length;

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('fc_prev')
                .setLabel('◀️ Thẻ trước')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(currentIndex === 0),

            new ButtonBuilder()
                .setCustomId('fc_flip')
                .setLabel(isFlipped ? '↩️ Lật lại Mặt trước' : '🔄 Lật xem Đáp án')
                .setStyle(isFlipped ? ButtonStyle.Success : ButtonStyle.Primary),

            new ButtonBuilder()
                .setCustomId('fc_next')
                .setLabel('▶️ Thẻ tiếp')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(currentIndex === total - 1),

            new ButtonBuilder()
                .setCustomId('fc_shuffle')
                .setLabel('🔀 Tráo thẻ')
                .setStyle(ButtonStyle.Danger)
        );

        return [row];
    }

    const initialData = {
        content: `🎴 **BỘ FLASHCARD TƯƠNG TÁC LẬT THẺ: ${topicName.toUpperCase()}**\n*(Đã sẵn sàng! Bấm nút bên dưới để lật mặt trước/mặt sau)*`,
        embeds: [buildEmbed()],
        components: buildButtons()
    };

    let initialMessage;
    if (typeof target.edit === 'function') {
        initialMessage = await target.edit(initialData);
    } else if (target.deferred || target.replied) {
        initialMessage = await target.editReply(initialData);
    } else if (target.reply) {
        initialMessage = await target.reply(initialData);
    } else {
        initialMessage = await target.send(initialData);
    }

    const messageToCollect = initialMessage || target;

    // Lắng nghe sự kiện bấm nút trong 15 phút
    const collector = messageToCollect.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 900000 // 15 phút
    });

    collector.on('collect', async (interaction) => {
        try {
            if (interaction.customId === 'fc_flip') {
                isFlipped = !isFlipped;
            } else if (interaction.customId === 'fc_next') {
                if (currentIndex < cards.length - 1) {
                    currentIndex++;
                    isFlipped = false;
                }
            } else if (interaction.customId === 'fc_prev') {
                if (currentIndex > 0) {
                    currentIndex--;
                    isFlipped = false;
                }
            } else if (interaction.customId === 'fc_shuffle') {
                for (let i = cards.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [cards[i], cards[j]] = [cards[j], cards[i]];
                }
                currentIndex = 0;
                isFlipped = false;
            }

            await interaction.update({
                embeds: [buildEmbed()],
                components: buildButtons()
            });
        } catch (err) {
            console.error('❌ Lỗi bấm nút Flashcard:', err.message);
        }
    });

    collector.on('end', () => {
        try {
            const disabledRow = new ActionRowBuilder().addComponents(
                buildButtons()[0].components.map(b => ButtonBuilder.from(b).setDisabled(true))
            );
            if (initialMessage && initialMessage.edit) {
                initialMessage.edit({ components: [disabledRow] }).catch(() => {});
            }
        } catch (e) {}
    });
}

/**
 * Hàm tạo Flashcard từ đoạn văn bản hoặc tài liệu thô bằng OpenRouter AI
 */
async function generateFlashcardsFromText(rawText, title = 'Tài liệu', count = 5) {
    if (!rawText || !rawText.trim()) {
        throw new Error('Nội dung văn bản trống, không thể tạo Flashcard!');
    }

    const trimmedText = rawText.trim().substring(0, 8000);

    const prompt = `Bạn là chuyên gia thiết kế Flashcard học tập. Hãy tạo bộ ${count} thẻ Flashcard từ nội dung bên dưới.
TIÊU ĐỀ: "${title}"
NỘI DUNG:
"""
${trimmedText}
"""

YÊU CẦU ĐỊNH DẠNG (Xuất ra đúng cấu trúc này):
🎴 **Thẻ 1:**
- ❓ **Mặt trước (Khái niệm / Câu hỏi):** [Nêu câu hỏi/khái niệm]
- 💡 **Mặt sau (Giải thích / Chi tiết):** [Nêu câu trả lời/giải thích]

🎴 **Thẻ 2:**
- ❓ **Mặt trước (Khái niệm / Câu hỏi):** [Nêu câu hỏi/khái niệm]
- 💡 **Mặt sau (Giải thích / Chi tiết):** [Nêu câu trả lời/giải thích]`;

    const aiRawResult = await askAI(prompt);
    return parseFlashcardsToData(aiRawResult);
}

/**
 * Hàm tìm bài đăng/tài liệu trong Server Discord và tự động chuyển đổi thành bộ Flashcards
 */
async function generateFlashcardsFromServer(query, guild, channelId = null) {
    if (!guild) {
        throw new Error('Cần thông tin Server (Guild) để tạo Flashcards!');
    }

    const serverData = await getServerContext(guild);

    const prompt = `Người dùng yêu cầu TẠO BỘ FLASHCARD từ các bài đăng, tài liệu hoặc thảo luận trong Server Discord về chủ đề: "${query}".

DỮ LIỆU SERVER:
${serverData}

YÊU CẦU ĐỊNH DẠNG:
🎴 **Thẻ 1:**
- ❓ **Mặt trước (Khái niệm / Câu hỏi):** ...
- 💡 **Mặt sau (Giải thích / Chi tiết):** ...

🎴 **Thẻ 2:**
- ❓ **Mặt trước (Khái niệm / Câu hỏi):** ...
- 💡 **Mặt sau (Giải thích / Chi tiết):** ...`;

    const aiRawResult = await askAIServer(prompt, guild, channelId);
    return parseFlashcardsToData(aiRawResult);
}

/**
 * Hàm tạo Flashcard từ file đính kèm Discord hoặc file trên server
 */
async function generateFlashcardsFromFile(attachmentUrl, fileName, serverFileName) {
    let textContent = '';
    let targetTitle = '';

    if (attachmentUrl && fileName) {
        textContent = await fetchAndExtractText(attachmentUrl, fileName);
        targetTitle = fileName;
    } else if (serverFileName) {
        const targetPath = path.resolve(__dirname, '../', serverFileName);
        if (!fs.existsSync(targetPath) || !fs.statSync(targetPath).isFile()) {
            throw new Error(`Không tìm thấy file \`${serverFileName}\` trên máy chủ!`);
        }
        const buffer = fs.readFileSync(targetPath);
        textContent = await extractTextFromBuffer(serverFileName, buffer);
        targetTitle = serverFileName;
    } else {
        throw new Error('Cần đính kèm 1 file hoặc nhập tên file để tạo Flashcards!');
    }

    return await generateFlashcardsFromText(textContent, targetTitle, 5);
}

module.exports = {
    generateFlashcardsFromText,
    generateFlashcardsFromServer,
    generateFlashcardsFromFile,
    parseFlashcardsToData,
    sendInteractiveFlashcards
};
