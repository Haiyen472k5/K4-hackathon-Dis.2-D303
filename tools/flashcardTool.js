const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, AttachmentBuilder } = require('discord.js');
const { askAI, askAIServer, getServerContext } = require('./aiTool');
const { fetchAndExtractText, extractTextFromBuffer } = require('./documentTool');
const { createCanvas, GlobalFonts } = require('@napi-rs/canvas');
const fs = require('fs');
const path = require('path');

// 🔤 ĐĂNG KÝ PHÔNG CHỮ TIẾNG VIỆT CHUẨN WINDOWS (Segoe UI / Arial)
try {
    if (fs.existsSync('C:\\Windows\\Fonts\\segoeui.ttf')) {
        GlobalFonts.registerFromPath('C:\\Windows\\Fonts\\segoeui.ttf', 'SegoeUI');
    }
    if (fs.existsSync('C:\\Windows\\Fonts\\arial.ttf')) {
        GlobalFonts.registerFromPath('C:\\Windows\\Fonts\\arial.ttf', 'ArialFont');
    }
} catch (e) {}

const FONT_FAMILY = 'SegoeUI, ArialFont, "Segoe UI", Arial, sans-serif';

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

    // 2. Parse theo Thẻ 1, Thẻ 2... hoặc 🎴
    const cards = [];
    const blocks = text.split(/(?:🎴|\*\*Thẻ\s*\d+[\:\*]*|Thẻ\s*\d+[\:\*]*)/gi);

    for (const block of blocks) {
        if (!block || !block.trim()) continue;

        const lines = block.split(/\r?\n/);
        for (const line of lines) {
            const cleanLine = line.trim();
            if (!cleanLine) continue;

            if (cleanLine.includes('❓') || /mặt\s*trước|khái\s*niệm|câu\s*hỏi/i.test(cleanLine)) {
                if (cleanLine.includes(':')) {
                    front = cleanLine.split(':').slice(1).join(':').replace(/\*\*/g, '').trim();
                } else {
                    front = cleanLine.replace(/^[\s\-\*\#\🎴\❓\💡]+/g, '').replace(/\*\*/g, '').trim();
                }
            } else if (cleanLine.includes('💡') || /mặt\s*sau|giải\s*thích|đáp\s*án/i.test(cleanLine)) {
                if (cleanLine.includes(':')) {
                    back = cleanLine.split(':').slice(1).join(':').replace(/\*\*/g, '').trim();
                } else {
                    back = cleanLine.replace(/^[\s\-\*\#\🎴\❓\💡]+/g, '').replace(/\*\*/g, '').trim();
                }
            }
        }

        if (front || back) {
            cards.push({
                front: front || 'Khái niệm / Câu hỏi',
                back: back || 'Giải thích chi tiết'
            });
        }
    }

    if (cards.length > 0) return cards;

    // 3. Fallback: Parse từng dòng câu hỏi & trả lời
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    let currentFront = '';
    let currentBack = '';

    for (const line of lines) {
        if (line.includes('?') || line.toLowerCase().includes('mặt trước')) {
            if (currentFront && currentBack) {
                cards.push({ front: currentFront, back: currentBack });
                currentBack = '';
            }
            currentFront = line.replace(/^[\s\-\*\d\.\🎴\❓\💡]+/g, '').trim();
        } else if (currentFront) {
            currentBack += (currentBack ? '\n' : '') + line.replace(/^[\s\-\*\d\.\🎴\❓\💡]+/g, '').trim();
        }
    }

    if (currentFront) {
        cards.push({ front: currentFront, back: currentBack || 'Giải thích chi tiết' });
    }

    return cards.length > 0 ? cards : [
        { front: 'Nội dung Thẻ Bài', back: text.substring(0, 500) }
    ];
}

function wrapText(ctx, text, maxWidth) {
    if (!text) return [];
    const words = text.split(/\s+/);
    const lines = [];
    let currentLine = words[0] || '';

    for (let i = 1; i < words.length; i++) {
        const word = words[i];
        const width = ctx.measureText(currentLine + " " + word).width;
        if (width < maxWidth) {
            currentLine += " " + word;
        } else {
            lines.push(currentLine);
            currentLine = word;
        }
    }
    lines.push(currentLine);
    return lines;
}

/**
 * Tạo hình ảnh Thẻ Bài Flashcard đồ họa sắc nét bằng Canvas (CHỮ RẤT TO, ĐẮNG CẤP, RÕ RÀNG)
 */
function renderFlashcardImage(card, index, total, isFlipped, topicName = 'Tài liệu') {
    const width = 850;
    const height = 480;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // 1. Nền Gradient & Viền Sáng Rực Rỡ
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    if (!isFlipped) {
        // Mặt trước: Tím Xanh Indigo Đẳng Cấp
        bgGrad.addColorStop(0, '#1E1B4B');
        bgGrad.addColorStop(0.5, '#312E81');
        bgGrad.addColorStop(1, '#0F172A');
    } else {
        // Mặt sau: Xanh Lục Emerald Sang Trọng
        bgGrad.addColorStop(0, '#064E3B');
        bgGrad.addColorStop(0.5, '#047857');
        bgGrad.addColorStop(1, '#022C22');
    }

    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // 2. Khung Viền Cong Bo Tròn Sắc Nét
    ctx.lineWidth = 6;
    ctx.strokeStyle = isFlipped ? '#34D399' : '#818CF8';
    ctx.roundRect(20, 20, width - 40, height - 40, 20);
    ctx.stroke();

    // Hộp Thủy Tinh Inner Box
    ctx.fillStyle = 'rgba(255, 255, 255, 0.09)';
    ctx.roundRect(35, 35, width - 70, height - 70, 16);
    ctx.fill();

    // 3. Badge Tiêu Đề Trạng Thái
    const badgeText = isFlipped ? '💡 MẶT SAU — GIẢI THÍCH / ĐÁP ÁN' : '❓ MẶT TRƯỚC — KHÁI NIỆM / CÂU HỎI';
    ctx.fillStyle = isFlipped ? '#10B981' : '#6366F1';
    ctx.roundRect(50, 50, 420, 44, 22);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold 20px ${FONT_FAMILY}`;
    ctx.fillText(badgeText, 70, 78);

    // Tiến trình Thẻ (VD: THẺ 1/5)
    ctx.fillStyle = '#F1F5F9';
    ctx.font = `bold 22px ${FONT_FAMILY}`;
    ctx.fillText(`THẺ ${index + 1} / ${total}`, width - 160, 78);

    // Tên Chủ Đề
    ctx.fillStyle = '#CBD5E1';
    ctx.font = `italic 18px ${FONT_FAMILY}`;
    const cleanTopic = topicName.length > 50 ? topicName.substring(0, 50) + '...' : topicName;
    ctx.fillText(`📌 Chủ đề: ${cleanTopic}`, 50, 122);

    // Đường Kẻ Ngang Phân Cách
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 136);
    ctx.lineTo(width - 50, 136);
    ctx.stroke();

    // 4. Xử Lý & Làm Sạch Văn Bản (Giữ nguyên văn bản chính)
    let rawText = isFlipped ? (card.back || 'Mặt sau') : (card.front || 'Mặt trước');
    let cleanText = rawText
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/`/g, '')
        .replace(/^>>>\s*/g, '')
        .replace(/^[\s\-\:\*\_\#\🎴\❓\💡]+/g, '')
        .replace(/^(?:Mặt trước|Mặt sau|Khái niệm\/Câu hỏi|Thuật ngữ\/Câu hỏi|Giải thích\/Chi tiết)[\s\(\)\:\/]*[\:\-]?\s*/gi, '')
        .trim();

    // ⚡ QUAN TRỌNG: Nếu làm sạch xong bị rỗng, dùng nguyên bản rawText!
    if (!cleanText || cleanText.length === 0) {
        cleanText = rawText.replace(/\*\*/g, '').replace(/\*/g, '').replace(/`/g, '').trim();
    }

    ctx.fillStyle = '#FFFFFF';
    
    // ⚡ CHỮ RẤT TO, BÓNG BẨY (40px cho câu ngắn, 32px cho câu trung bình)
    let fontSize = 40;
    if (cleanText.length > 80) fontSize = 32;
    if (cleanText.length > 200) fontSize = 26;
    if (cleanText.length > 350) fontSize = 22;

    ctx.font = `bold ${fontSize}px ${FONT_FAMILY}`;

    const lines = wrapText(ctx, cleanText, width - 100);
    const startY = 185;
    const lineHeight = fontSize + 16;

    for (let i = 0; i < Math.min(lines.length, 6); i++) {
        ctx.fillText(lines[i], 50, startY + (i * lineHeight));
    }

    // 5. Chú Thích Chân Thẻ
    ctx.fillStyle = '#94A3B8';
    ctx.font = `bold 16px ${FONT_FAMILY}`;
    const footerText = isFlipped ? '👉 Bấm nút [↩️ Lật lại Mặt trước] để quay lại' : '👉 Bấm nút [🔄 Lật xem Đáp án] để lật sang mặt sau';
    ctx.fillText(footerText, 50, height - 48);

    return canvas.toBuffer('image/png');
}

/**
 * Gửi và quản lý bộ Flashcard tương tác Lật Thẻ bằng Button & Hình ảnh Canvas đồ họa
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

    function buildPayload() {
        const total = cards.length;
        const currentCard = cards[currentIndex];
        const buffer = renderFlashcardImage(currentCard, currentIndex, total, isFlipped, topicName);
        const attachment = new AttachmentBuilder(buffer, { name: 'flashcard.png' });

        const embed = new EmbedBuilder()
            .setColor(isFlipped ? 0x57F287 : 0x5865F2)
            .setTitle(`🎴 THẺ BÀI FLASHCARD HỌC TẬP — [Thẻ ${currentIndex + 1}/${total}]`)
            .setImage('attachment://flashcard.png')
            .setFooter({ text: isFlipped ? '↩️ Bấm nút [↩️ Lật lại Mặt trước] để quay lại!' : '💡 Bấm nút [🔄 Lật xem Đáp án] để lật xem mặt sau!' })
            .setTimestamp();

        return { embed, attachment };
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

    const firstPayload = buildPayload();
    const initialData = {
        content: `🎴 **BỘ THẺ BÀI FLASHCARD TƯƠNG TÁC: ${topicName.toUpperCase()}**\n*(Đã vẽ hình ảnh thẻ bài! Bấm nút bên dưới để Lật Thẻ bài)*`,
        embeds: [firstPayload.embed],
        files: [firstPayload.attachment],
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

            const nextPayload = buildPayload();
            await interaction.update({
                embeds: [nextPayload.embed],
                files: [nextPayload.attachment],
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
    renderFlashcardImage,
    generateFlashcardsFromText,
    generateFlashcardsFromServer,
    generateFlashcardsFromFile,
    parseFlashcardsToData,
    sendInteractiveFlashcards
};
