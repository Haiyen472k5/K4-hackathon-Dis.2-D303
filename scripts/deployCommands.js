require('dotenv').config({ quiet: true });
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const BOT_TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

if (!BOT_TOKEN || !CLIENT_ID) {
    console.error('❌ Vui lòng kiểm tra BOT_TOKEN và CLIENT_ID trong file .env!');
    process.exit(1);
}

const commands = [
    new SlashCommandBuilder()
        .setName('hi')
        .setDescription('Gửi lời chào thân thiện đến bạn!'),
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
        ),
    new SlashCommandBuilder()
        .setName('summarize')
        .setDescription('Tóm tắt 3-5 ý chính từ file tài liệu hoặc đoạn văn bản bằng AI')
        .addAttachmentOption(option =>
            option.setName('file')
                .setDescription('Tải lên file Word (.docx), PDF (.pdf) hoặc Text (.txt, .md)')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('filename')
                .setDescription('Tên file trên máy chủ (VD: 01-de-bai.md, README.md)')
                .setRequired(false)
        )
        .addStringOption(option =>
            option.setName('text')
                .setDescription('Đoạn văn bản trực tiếp cần tóm tắt')
                .setRequired(false)
        ),
    new SlashCommandBuilder()
        .setName('search')
        .setDescription('Tìm kiếm các bài đăng trong mục chia-sẻ theo từ khóa')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Từ khóa cần tìm (VD: mèo, rắn, mặt trời)')
                .setRequired(true)
        ),
    new SlashCommandBuilder()
        .setName('ask')
        .setDescription('Hỏi đáp AI với 2 chế độ (Nội bộ Server hoặc Kiến thức chung)')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('Nội dung câu hỏi hoặc yêu cầu dành cho AI')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('Chọn phạm vi tìm kiếm của AI (Mặc định: Nội bộ Server)')
                .setRequired(false)
                .addChoices(
                    { name: '🏠 Nội bộ Server (Chỉ tìm bài đăng/chat trong Discord)', value: 'server' },
                    { name: '🌐 Kiến thức chung (Hỏi AI tự do trên internet)', value: 'general' }
                )
        ),
    new SlashCommandBuilder()
        .setName('ask_server')
        .setDescription('Hỏi AI CHỈ TÌM bài đăng & cuộc trò chuyện trong Server Discord này')
        .addStringOption(option =>
            option.setName('question')
                .setDescription('Tên bài đăng hoặc chủ đề bạn cần tìm trong Server')
                .setRequired(true)
        )
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

async function deploy() {
    console.log('🔄 Đang đồng bộ danh sách Slash Commands với Discord API...');
    try {
        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands }
        );
        console.log('✅ Đã đồng bộ thành công Slash Commands!');
    } catch (error) {
        console.error('❌ Lỗi đồng bộ Slash Commands:', error);
    }
}

deploy();
