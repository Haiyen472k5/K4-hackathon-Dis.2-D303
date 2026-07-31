// File code nâng cấp cho Bot đọc tài liệu (/read và đính kèm file Word/PDF/Text trực tiếp trong chat)
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth'); // Đọc file Word (.docx)
const pdfParse = require('pdf-parse'); // Đọc file PDF (.pdf)

// 1. CẤU HÌNH TOKEN VÀ ID CỦA BOT
const BOT_TOKEN = process.env.BOT_TOKEN || 'YOUR_DISCORD_BOT_TOKEN';
const CLIENT_ID = process.env.CLIENT_ID || 'YOUR_CLIENT_ID';

// 2. KHỞI TẠO BOT
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// 🛠️ Hàm trích xuất văn bản từ Buffer dựa theo định dạng file (.docx, .pdf, .txt, .md, ...)
async function extractTextFromBuffer(fileName, buffer) {
    const ext = path.extname(fileName).toLowerCase();

    // 1. File Word (.docx)
    if (ext === '.docx') {
        const result = await mammoth.extractRawText({ buffer: buffer });
        return result.value || '';
    }

    // 2. File PDF (.pdf)
    if (ext === '.pdf') {
        const data = await pdfParse(buffer);
        return data.text || '';
    }

    // 3. File Word cũ (.doc)
    if (ext === '.doc') {
        throw new Error('Định dạng .doc (Word cũ) không hỗ trợ trực tiếp. Vui lòng chuyển file sang .docx hoặc .pdf!');
    }

    // 4. Phát hiện file binary / ZIP nếu chứa header PK!
    const isZipHeader = buffer.length >= 4 && buffer[0] === 0x50 && buffer[1] === 0x4b;
    if (isZipHeader && ext !== '.docx') {
        throw new Error('File nén nhị phân (ZIP/Binary) không thể đọc trực tiếp thành văn bản!');
    }

    // 5. Mặc định đọc dạng UTF-8 cho các file text (.txt, .md, .js, .json, .csv, ...)
    return buffer.toString('utf8');
}

// 🛠️ Hàm tải file từ URL đính kèm Discord
async function fetchAndExtractText(attachmentUrl, fileName) {
    const response = await fetch(attachmentUrl);
    if (!response.ok) {
        throw new Error(`Tải file thất bại với mã lỗi HTTP ${response.status}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return await extractTextFromBuffer(fileName, buffer);
}

// 🛠️ Hàm cắt tối đa 300 chữ và định dạng phản hồi
function formatDocumentResponse(fileName, rawContent) {
    const trimmed = rawContent.trim();
    if (!trimmed) {
        return `📄 **Tài liệu:** \`${fileName}\`\n\n⚠️ *(Tài liệu trống hoặc không tìm thấy văn bản có thể đọc)*`;
    }

    const words = trimmed.split(/\s+/);
    const totalWords = words.length;
    const isTruncated = totalWords > 300;
    const textContent = isTruncated ? words.slice(0, 300).join(' ') : trimmed;

    let responseHeader = `📄 **Tài liệu:** \`${fileName}\` (Hiển thị ${Math.min(totalWords, 300)}/${totalWords} chữ)\n\n`;
    let responseContent = `\`\`\`text\n${textContent}\n\`\`\``;
    let responseFooter = isTruncated ? `\n\n⚠️ *(Nội dung đã được cắt bớt, chỉ hiển thị 300 chữ đầu tiên)*` : '';

    let fullMessage = responseHeader + responseContent + responseFooter;

    // Giới hạn 2000 ký tự tin nhắn của Discord
    if (fullMessage.length > 1950) {
        const maxCharLength = 1950 - responseHeader.length - responseFooter.length - 10;
        responseContent = `\`\`\`text\n${textContent.substring(0, maxCharLength)}...\n\`\`\``;
        fullMessage = responseHeader + responseContent + responseFooter;
    }

    return fullMessage;
}

// 3. ĐỒNG BỘ LỆNH SLASH COMMAND (/read)
const commands = [
    new SlashCommandBuilder()
        .setName('read')
        .setDescription('Đọc tài liệu Word, PDF, Text (tối đa 300 chữ đầu)')
        .addAttachmentOption(option =>
            option.setName('file')
                .setDescription('Tải lên file tài liệu đính kèm (.docx, .pdf, .txt, .md,...)')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('filename')
                .setDescription('Tên file có sẵn trên máy chủ (VD: 01-de-bai.md, README.md)')
                .setRequired(false)
        )
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

client.once('ready', async () => {
    console.log(`🤖 Bot Đọc Tài Liệu (Word/PDF/Text) đã sẵn sàng! Đăng nhập: ${client.user.tag}`);

    try {
        console.log('🔄 Đang đồng bộ lệnh Slash Command (/read)...');

        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands }
        );

        console.log('✅ Đã đồng bộ thành công lệnh Slash Command /read!');
    } catch (error) {
        console.error('❌ Lỗi khi đồng bộ lệnh:', error);
    }
});

// 4. XỬ LÝ LỆNH SLASH COMMAND /read
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'read') {
        const attachment = interaction.options.getAttachment('file');
        const fileName = interaction.options.getString('filename');

        // TRƯỜNG HỢP A: Đính kèm file trong Slash Command /read
        if (attachment) {
            await interaction.deferReply();
            try {
                const textContent = await fetchAndExtractText(attachment.url, attachment.name);
                const replyText = formatDocumentResponse(attachment.name, textContent);
                await interaction.editReply(replyText);
            } catch (err) {
                console.error('❌ Lỗi khi đọc file đính kèm:', err);
                await interaction.editReply(`❌ Không thể đọc file đính kèm: ${err.message}`);
            }
            return;
        }

        // TRƯỜNG HỢP B: Nhập tên file có sẵn trên hệ thống máy chủ
        if (fileName) {
            const targetPath = path.resolve(__dirname, fileName);

            if (!targetPath.startsWith(__dirname)) {
                return interaction.reply({ content: '❌ Đường dẫn file không hợp lệ!', ephemeral: true });
            }

            if (!fs.existsSync(targetPath) || !fs.statSync(targetPath).isFile()) {
                const availableFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('.md') || f.endsWith('.txt') || f.endsWith('.docx') || f.endsWith('.pdf'));
                return interaction.reply({
                    content: `❌ Không tìm thấy tài liệu \`${fileName}\`!\n\n📄 **Các tài liệu có sẵn bạn có thể đọc:**\n${availableFiles.map(f => `- \`${f}\``).join('\n')}`,
                    ephemeral: true
                });
            }

            try {
                const buffer = fs.readFileSync(targetPath);
                const rawContent = await extractTextFromBuffer(fileName, buffer);
                const replyText = formatDocumentResponse(fileName, rawContent);
                await interaction.reply(replyText);
            } catch (error) {
                console.error('❌ Lỗi khi đọc file:', error);
                await interaction.reply({ content: `❌ Lỗi khi đọc tài liệu: ${error.message}`, ephemeral: true });
            }
            return;
        }

        await interaction.reply({
            content: '⚠️ Vui lòng đính kèm 1 file tài liệu (mục `file`) HOẶC nhập tên file cần đọc (mục `filename`)!',
            ephemeral: true
        });
    }
});

// 5. XỬ LÝ KHI GỬI FILE ĐÍNH KÈM TRỰC TIẾP TRONG CHAT THƯỜNG
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // Nếu người dùng tải file đính kèm lên ô chat kèm chữ `read` hoặc `)(read`
    if (message.attachments.size > 0 && (message.content.toLowerCase().includes('read') || message.content.includes(')(read'))) {
        const attachment = message.attachments.first();
        try {
            const textContent = await fetchAndExtractText(attachment.url, attachment.name);
            const replyText = formatDocumentResponse(attachment.name, textContent);
            await message.reply(replyText);
        } catch (err) {
            console.error('❌ Lỗi khi đọc file đính kèm từ chat:', err);
            await message.reply(`❌ Lỗi đọc file \`${attachment.name}\`: ${err.message}`);
        }
        return;
    }

    // Nhắc nhở nếu người dùng gõ `)(read` mà quên gửi file
    if (message.content.trim() === ')(read' && message.attachments.size === 0) {
        await message.reply('💡 Bạn hãy **đính kèm 1 file Word (.docx), PDF (.pdf) hoặc Text (.txt, .md)** cùng với tin nhắn `)(read` để Bot đọc giúp nhé!');
    }
});

// 6. KHỞI ĐỘNG BOT
client.login(BOT_TOKEN);
