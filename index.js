// Import các thư viện cần thiết
require('dotenv').config({ quiet: true }); // Load biến môi trường từ .env
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Import các công cụ xử lý nghiệp vụ từ folder tools/
const { extractTextFromBuffer, fetchAndExtractText, formatDocumentResponse } = require('./tools/documentTool');
const { searchThreadsByKeyword } = require('./tools/searchTool');
const { askAI, askAIServer, OPENROUTER_MODEL } = require('./tools/aiTool');
const { summarizeText, summarizeDocument } = require('./tools/summarizeTool');
const { searchChatLogs } = require('./tools/chatHistoryTool');
const { logApiCall, logApiResponse, logApiError, LOG_FILE_PATH } = require('./tools/apiLogger');

// Bắt các lỗi toàn cục để tự động ghi log vào api_logs.txt giúp dễ dàng debug
process.on('unhandledRejection', (reason) => {
    const error = reason instanceof Error ? reason : new Error(String(reason));
    logApiError('Unhandled Promise Rejection', 0, error, { extra: 'Global Process' });
});

process.on('uncaughtException', (err) => {
    logApiError('Uncaught Exception', 0, err, { extra: 'Global Process' });
});

// 1. CẤU HÌNH TOKEN VÀ ID BOT
const BOT_TOKEN = process.env.BOT_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

// 2. KHỞI TẠO BOT VỚI CÁC QUYỀN CẦN THIẾT
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// 3. ĐỒNG BỘ LỆNH SLASH COMMANDS (/hi, /read, /summarize, /search, /ask, /ask_server)
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

async function sendLongMessage(target, text) {
    if (!text || !text.trim()) return;

    const MAX_LENGTH = 1900;
    if (text.length <= MAX_LENGTH) {
        if (target.deferred || target.replied) {
            return await target.editReply(text);
        } else if (target.reply) {
            return await target.reply(text);
        } else {
            return await target.send(text);
        }
    }

    const lines = text.split('\\n');
    let chunks = [];
    let currentChunk = '';

    for (const line of lines) {
        if ((currentChunk + '\\n' + line).length > MAX_LENGTH) {
            if (currentChunk.trim()) chunks.push(currentChunk.trim());
            currentChunk = line;
        } else {
            currentChunk = currentChunk ? currentChunk + '\\n' + line : line;
        }
    }
    if (currentChunk.trim()) chunks.push(currentChunk.trim());

    let firstChunk = chunks.shift();
    if (target.deferred || target.replied) {
        await target.editReply(firstChunk);
    } else if (target.reply) {
        await target.reply(firstChunk);
    } else {
        await target.send(firstChunk);
    }

    for (const chunk of chunks) {
        if (target.channel && target.channel.send) {
            await target.channel.send(chunk);
        } else if (target.followUp) {
            await target.followUp(chunk);
        }
    }
}
client.once('ready', async () => {
    console.log(`🤖 Bot đã sẵn sàng! Đăng nhập dưới tên: ${client.user.tag}`);
    console.log(`🧠 Mô hình OpenRouter AI đang cấu hình: ${OPENROUTER_MODEL}`);

    try {
        console.log('🔄 Đang đồng bộ các lệnh Slash Command (/hi, /read, /summarize, /search, /ask, /ask_server)...');

        // 1. Đăng ký Global Commands
        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands }
        );

        // 2. Đăng ký tức thì cho từng Server (Guild)
        client.guilds.cache.forEach(async (guild) => {
            try {
                await rest.put(
                    Routes.applicationGuildCommands(CLIENT_ID, guild.id),
                    { body: commands }
                );
                console.log(`⚡ Đã đồng bộ tức thì menu lệnh Slash Command cho Server: ${guild.name}`);
            } catch (err) {
                console.error(`❌ Lỗi đồng bộ server ${guild.name}:`, err.message);
            }
        });

        console.log('✅ Đã đồng bộ thành công tất cả lệnh Slash Command lên Discord!');
    } catch (error) {
        console.error('❌ Lỗi khi đồng bộ lệnh:', error);
    }
});

// 4. XỬ LÝ CÁC LỆNH SLASH COMMANDS
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    // A. Xử lý /hi
    if (interaction.commandName === 'hi') {
        const userName = interaction.user.displayName;
        await interaction.reply(`👋 Xin chào **${userName}**! Chúc bạn một ngày tốt lành!`);
        return;
    }

    // B. Xử lý /search (Tìm từ khóa trong kênh chia-sẻ)
    if (interaction.commandName === 'search') {
        const query = interaction.options.getString('query').toLowerCase().trim();
        await interaction.deferReply();

        try {
            const matchedThreads = await searchThreadsByKeyword(interaction.guild, query);

            if (matchedThreads.length === 0) {
                return interaction.editReply(`🔍 Không tìm thấy bài đăng nào chứa từ khóa **"${query}"** trong kênh **#chia-sẻ**.`);
            }

            const resultList = matchedThreads.slice(0, 10).map((t, idx) =>
                `**${idx + 1}.** [${t.name}](https://discord.com/channels/${interaction.guildId}/${t.id})`
            ).join('\n');

            await interaction.editReply(`🔍 **Tìm thấy ${matchedThreads.length} bài đăng phù hợp với từ khóa "${query}":**\n\n${resultList}`);
        } catch (err) {
            console.error('❌ Lỗi khi tìm kiếm bài đăng:', err);
            await interaction.editReply(`❌ ${err.message}`);
        }
        return;
    }

    // C. Xử lý /read (Đọc file tài liệu)
    if (interaction.commandName === 'read') {
        const attachment = interaction.options.getAttachment('file');
        const fileName = interaction.options.getString('filename');

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
        return;
    }

    // D. Xử lý /summarize (Tóm tắt file hoặc văn bản bằng AI)
    if (interaction.commandName === 'summarize') {
        const attachment = interaction.options.getAttachment('file');
        const fileName = interaction.options.getString('filename');
        const textInput = interaction.options.getString('text');

        await interaction.deferReply();

        try {
            let summary = '';
            if (attachment) {
                summary = await summarizeDocument(attachment.url, attachment.name, null);
            } else if (fileName) {
                summary = await summarizeDocument(null, null, fileName);
            } else if (textInput) {
                summary = await summarizeText(textInput, 'Đoạn văn bản');
            } else {
                return interaction.editReply('⚠️ Vui lòng đính kèm 1 file, nhập tên file (mục `filename`) hoặc nhập đoạn văn bản (mục `text`) để tóm tắt!');
            }

            const header = '';
            await sendLongMessage(interaction, summary);
        } catch (err) {
            console.error('❌ Lỗi khi tóm tắt:', err);
            await interaction.editReply(`❌ Lỗi tóm tắt: ${err.message}`);
        }
        return;
    }

    // E. Xử lý /ask (Hỏi đáp AI với 2 mode: Server vs General)
    if (interaction.commandName === 'ask') {
        const question = interaction.options.getString('question');
        const mode = interaction.options.getString('mode') || 'server';
        await interaction.deferReply();

        try {
            let answer = '';
            let header = '';
            if (mode === 'general') {
                answer = await askAI(question, interaction.channelId);
                header = '';
            } else {
                answer = await askAIServer(question, interaction.guild, interaction.channelId);
                header = '';
            }

            await sendLongMessage(interaction, answer);
        } catch (err) {
            console.error('❌ Lỗi gọi OpenRouter AI:', err);
            await interaction.editReply(`❌ Không thể kết nối với OpenRouter AI: ${err.message}`);
        }
        return;
    }

    // F. Xử lý /ask_server (Chỉ tìm bài đăng & chat trong Server Discord)
    if (interaction.commandName === 'ask_server') {
        const question = interaction.options.getString('question');
        await interaction.deferReply();

        try {
            const answer = await askAIServer(question, interaction.guild, interaction.channelId);
            const header = '';
            await sendLongMessage(interaction, answer);
        } catch (err) {
            console.error('❌ Lỗi gọi OpenRouter AI Server:', err);
            await interaction.editReply(`❌ Không thể kết nối với AI Server: ${err.message}`);
        }
        return;
    }
});

// 5. XỬ LÝ MESSAGE (LỆNH PREFIX & AUTO LOGGING CHAT)
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // A. Lệnh Prefix )(hi
    if (message.content.trim() === ')(hi') {
        const userName = message.author.displayName || message.author.username;
        message.reply(`👋 Xin chào **${userName}**! Chúc bạn một ngày tốt lành!`);
    }

    // B. Lệnh Prefix )(search [từ khóa] hoặc )(tim [từ khóa]
    if (message.content.startsWith(')(search') || message.content.startsWith(')(tim')) {
        const query = message.content.replace(/^(\)\(search|\)\(tim)/i, '').trim().toLowerCase();
        if (!query) {
            return message.reply('💡 Vui lòng nhập từ khóa tìm kiếm! VD: `)(search mèo` hoặc `)(search rắn`');
        }

        try {
            const matchedThreads = await searchThreadsByKeyword(message.guild, query);

            if (matchedThreads.length === 0) {
                return message.reply(`🔍 Không tìm thấy bài đăng nào chứa từ khóa **"${query}"** trong kênh **#chia-sẻ**.`);
            }

            const resultList = matchedThreads.slice(0, 10).map((t, idx) =>
                `**${idx + 1}.** [${t.name}](https://discord.com/channels/${message.guildId}/${t.id})`
            ).join('\n');

            return message.reply(`🔍 **Tìm thấy ${matchedThreads.length} bài đăng phù hợp với từ khóa "${query}":**\n\n${resultList}`);
        } catch (err) {
            console.error('❌ Lỗi khi tìm kiếm bài đăng:', err);
            return message.reply(`❌ ${err.message}`);
        }
    }

    // C. Lệnh Prefix )(tomtat hoặc )(summarize
    if (message.content.startsWith(')(tomtat') || message.content.startsWith(')(summarize')) {
        const textContent = message.content.replace(/^(\)\(tomtat|\)\(summarize)/i, '').trim();
        const attachment = message.attachments.first();

        try {
            await message.channel.sendTyping();
            let summary = '';
            if (attachment) {
                summary = await summarizeDocument(attachment.url, attachment.name, null);
            } else if (textContent) {
                summary = await summarizeText(textContent, 'Đoạn tin nhắn');
            } else {
                return message.reply('💡 Vui lòng đính kèm 1 file (.docx, .pdf, .txt, .md) hoặc nhập văn bản sau lệnh `)(tomtat`!');
            }

            const header = '';
            await sendLongMessage(message, summary);
        } catch (err) {
            console.error('❌ Lỗi khi tóm tắt:', err);
            await message.reply(`❌ Lỗi tóm tắt: ${err.message}`);
        }
        return;
    }

    // D. Lệnh Prefix )(server [câu hỏi] (Chế độ CHỈ TÌM trong Server Discord)
    if (message.content.startsWith(')(server')) {
        const questionText = message.content.replace(/^(\)\(server)/i, '').trim();
        if (!questionText) {
            return message.reply('💡 Vui lòng nhập câu hỏi sau lệnh `)(server`! VD: `)(server bài đăng liên quan đến con mèo`');
        }

        try {
            await message.channel.sendTyping();
            const answer = await askAIServer(questionText, message.guild, message.channelId);
            const header = '';
            await sendLongMessage(message, answer);
        } catch (err) {
            console.error('❌ Lỗi gọi OpenRouter AI Server:', err);
            await message.reply(`❌ Lỗi AI Server: ${err.message}`);
        }
        return;
    }

    // E. Hỏi đáp OpenRouter AI qua prefix )(ask hoặc Tag Bot (@Botvodich [câu hỏi])
    const isAskPrefix = message.content.startsWith(')(ask');
    const isBotMentioned = message.mentions.has(client.user) || (client.user && message.mentions.users.has(client.user.id)) || (client.user && message.content.includes(client.user.id));

    if (isAskPrefix || (isBotMentioned && !message.content.startsWith(')('))) {
        let questionText = message.content
            .replace(/<@!?\d+>/g, '')
            .replace(/^(\)\(ask)/i, '')
            .trim();

        if (!questionText && isAskPrefix) {
            return message.reply('💡 Vui lòng nhập câu hỏi sau lệnh `)(ask`! VD: `)(ask bài đăng liên quan đến con mèo`');
        }

        if (questionText) {
            try {
                await message.channel.sendTyping();
                const answer = await askAIServer(questionText, message.guild, message.channelId);
                const header = '';
                await sendLongMessage(message, answer);
            } catch (err) {
                console.error('❌ Lỗi gọi OpenRouter AI:', err);
                await message.reply(`❌ Lỗi OpenRouter AI: ${err.message}`);
            }
        }
    }

    // F. Đọc file đính kèm trực tiếp trong chat (gửi file đính kèm kèm từ 'read' hoặc ')(read')
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
    } else if (message.content.trim() === ')(read' && message.attachments.size === 0) {
        await message.reply('💡 Bạn hãy **đính kèm 1 file Word (.docx), PDF (.pdf) hoặc Text (.txt, .md)** cùng với tin nhắn `)(read` để Bot đọc giúp nhé!');
    }

    // H. Lệnh Prefix )(reset hoặc )(clear (Xóa bộ nhớ ngữ cảnh trò chuyện của kênh)
    if (message.content.trim() === ')(reset' || message.content.trim() === ')(clear') {
        const { clearChannelHistory } = require('./tools/aiTool');
        clearChannelHistory(message.channelId);
        return message.reply('🧹 Đã xóa sạch bộ nhớ ngữ cảnh cuộc trò chuyện trong kênh này!');
    }

    // G. Tự động Log Chat vào file chat_logs.txt
    const timestamp = new Date().toLocaleString('vi-VN');
    const serverName = message.guild ? message.guild.name : 'Tin nhắn riêng (DM)';
    const channelName = message.channel.name || 'DM';
    const authorName = message.author.username;
    const content = message.content;

    const logOutput = `[${timestamp}] [S: ${serverName}] [#${channelName}] ${authorName}: ${content}\n`;
    console.log(logOutput.trim());

    fs.appendFile('chat_logs.txt', logOutput, 'utf8', (err) => {
        if (err) {
            console.error('❌ Lỗi khi ghi file log:', err);
        }
    });
});

// 6. KHỞI ĐỘNG BOT
client.login(BOT_TOKEN);
