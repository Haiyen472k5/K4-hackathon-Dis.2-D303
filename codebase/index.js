// Load environment variables từ file .env
require('dotenv').config();

// Import các class cần thiết từ thư viện discord.js
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const fs = require('fs'); // Thư viện có sẵn của Node.js để quản lý file
const { GoogleGenAI } = require('@google/genai'); // SDK Gemini chính thức

// Đọc system prompt từ file system_prompt.txt
let systemInstruction = "Bạn là trợ lý Discord.";
try {
    if (fs.existsSync('system_prompt.txt')) {
        systemInstruction = fs.readFileSync('system_prompt.txt', 'utf8');
    }
} catch (error) {
    console.error('❌ Lỗi khi đọc file system_prompt.txt:', error);
}

// Khởi tạo Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Bộ nhớ lưu các Chat Session của Gemini theo Channel ID
const activeChats = new Map();
const MAX_HISTORY_LIMIT = 20; // Giới hạn số lượng tin nhắn lưu lại trong lịch sử chat

// Hàm so khớp chuỗi thông minh (hỗ trợ Regex + tìm không dấu + không quan trọng thứ tự từ)
function matchQuery(targetText, query) {
    if (!targetText || !query) return false;
    const cleanTarget = targetText.toLowerCase();
    const cleanQuery = query.toLowerCase();

    // 1. Kiểm tra nếu query dạng regex: /pattern/flags (ví dụ: /report_.*\.pdf/i)
    const regexMatch = query.match(/^\/(.+)\/([gimsuy]*)$/);
    if (regexMatch) {
        try {
            const pattern = regexMatch[1];
            const flags = regexMatch[2];
            const regex = new RegExp(pattern, flags);
            return regex.test(targetText);
        } catch (e) {
            // Nếu sai cú pháp regex, bỏ qua chuyển sang so khớp text thường
        }
    }

    // 2. Chuyển đổi không dấu tiếng Việt
    const normalizedTarget = cleanTarget.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
    const normalizedQuery = cleanQuery.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');

    // 3. Tách từ khóa con và kiểm tra
    const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length > 0);
    if (queryWords.length === 0) return false;

    // Phải chứa tất cả các từ trong queryWords
    return queryWords.every(word => normalizedTarget.includes(word));
}

// Hàm hỗ trợ tìm kiếm bài viết (threads/posts) trong server Discord
async function searchForumPosts(guild, query, channelName) {
    if (!guild) return [];
    const results = [];

    // Lấy toàn bộ danh sách kênh của server
    let channels = guild.channels.cache;

    // Nếu có chỉ định tên kênh cụ thể, tiến hành lọc
    if (channelName) {
        const cleanChanName = channelName.replace('#', '').trim().toLowerCase();
        channels = channels.filter(c => c.name.toLowerCase() === cleanChanName);
    }

    for (const [id, channel] of channels) {
        try {
            // Kiểm tra xem kênh có hỗ trợ threads không
            if (typeof channel.threads?.fetchActive !== 'function') continue;

            // Tải về các threads đang hoạt động trong kênh này
            const activeThreadsResponse = await channel.threads.fetchActive();
            const threads = activeThreadsResponse.threads;

            for (const [threadId, thread] of threads) {
                const matchTitle = matchQuery(thread.name, query);
                let matchContent = false;
                let startMessageText = "";

                try {
                    // Tin nhắn đầu tiên (nội dung bài viết) có ID trùng với ID của Thread
                    const startMessage = await thread.messages.fetch(thread.id);
                    if (startMessage && startMessage.content) {
                        startMessageText = startMessage.content;
                        matchContent = matchQuery(startMessageText, query);
                    }
                } catch (err) {
                    // Bỏ qua lỗi nếu không thể fetch tin nhắn đầu do phân quyền hoặc quá cũ
                }

                if (matchTitle || matchContent) {
                    // Fetch username người tạo bài
                    let authorName = 'Ẩn danh';
                    if (thread.ownerId) {
                        try {
                            const member = await guild.members.fetch(thread.ownerId);
                            authorName = member.user.username;
                        } catch (e) { }
                    }

                    results.push({
                        title: thread.name,
                        author: authorName,
                        content: startMessageText.substring(0, 500), // Lấy tối đa 500 ký tự để tóm tắt
                        channel: channel.name,
                        url: thread.url,
                        createdAt: thread.createdAt ? thread.createdAt.toLocaleString('vi-VN') : 'Không rõ'
                    });
                }

                if (results.length >= 5) break;
            }
        } catch (error) {
            console.error(`❌ Lỗi khi quét bài viết trong kênh ${channel.name}:`, error);
        }
        if (results.length >= 5) break;
    }
    return results;
}

// Hàm hỗ trợ tìm kiếm file đính kèm (pdf, zip, png, docx...) trong server Discord
async function searchDiscordFiles(guild, query, channelName) {
    if (!guild) return [];
    const results = [];
    let channels = guild.channels.cache;

    if (channelName) {
        const cleanChanName = channelName.replace('#', '').trim().toLowerCase();
        channels = channels.filter(c => c.name.toLowerCase() === cleanChanName);
    }

    let channelsSearched = 0;
    for (const [id, channel] of channels) {
        if (channelsSearched >= 10) break; // Giới hạn quét tối đa 10 kênh để tránh rate limit
        try {
            if (!channel.isTextBased()) continue;

            // Tải về 50 tin nhắn gần nhất
            const messages = await channel.messages.fetch({ limit: 50 });
            // Lọc ra các tin nhắn có đính kèm file
            const messagesWithAttachments = messages.filter(m => m.attachments.size > 0);

            for (const [msgId, msg] of messagesWithAttachments) {
                for (const [attachmentId, attachment] of msg.attachments) {
                    if (matchQuery(attachment.name, query)) {
                        results.push({
                            fileName: attachment.name,
                            fileUrl: attachment.url,
                            fileSize: attachment.size || 0,
                            contentType: attachment.contentType || 'unknown',
                            channel: channel.name,
                            author: msg.author.username,
                            messageUrl: msg.url,
                            createdAt: msg.createdAt ? msg.createdAt.toLocaleString('vi-VN') : 'Không rõ'
                        });
                    }
                    if (results.length >= 5) break;
                }
                if (results.length >= 5) break;
            }
            channelsSearched++;
        } catch (error) {
            console.error(`❌ Lỗi khi tìm file trong kênh ${channel.name}:`, error);
        }
        if (results.length >= 5) break;
    }
    return results;
}

// Khai báo cấu trúc gọi hàm cho Gemini API
const searchDiscordTool = {
    functionDeclarations: [
        {
            name: 'searchForumPosts',
            description: 'Tìm kiếm các bài viết (threads hoặc bài viết forum) trong các kênh của server Discord theo từ khóa và tên kênh (nếu có). Trả về tiêu đề, nội dung gốc, tác giả và link bài viết.',
            parameters: {
                type: 'OBJECT',
                properties: {
                    query: {
                        type: 'STRING',
                        description: 'Từ khóa tìm kiếm trong tiêu đề hoặc nội dung bài viết (ví dụ: Whisper, Piper, báo cáo).'
                    },
                    channelName: {
                        type: 'STRING',
                        description: 'Tên của kênh cụ thể chứa bài viết nếu người dùng nhắc đến (ví dụ: tài-liệu, general). Không bắt buộc.'
                    }
                },
                required: ['query']
            }
        },
        {
            name: 'searchDiscordFiles',
            description: 'Tìm kiếm các file tài liệu đính kèm (pdf, zip, png, docx...) được tải lên các kênh trong server Discord theo từ khóa tên file và tên kênh (nếu có). Trả về tên file, link tải trực tiếp và link tin nhắn gốc.',
            parameters: {
                type: 'OBJECT',
                properties: {
                    query: {
                        type: 'STRING',
                        description: 'Từ khóa tìm kiếm trong tên file (ví dụ: báo cáo, slide, code).'
                    },
                    channelName: {
                        type: 'STRING',
                        description: 'Tên của kênh cụ thể cần tìm kiếm file (ví dụ: tài-liệu, general). Không bắt buộc.'
                    }
                },
                required: ['query']
            }
        }
    ]
};

// 1. CẤU HÌNH TOKEN VÀ ID CỦA BOT
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;
const CLIENT_ID = '1532330472234029096'; // Lấy ở mục General Information trên Developer Portal

// 2. KHỞI TẠO BOT VỚI CÁC QUYỀN (INTENTS) CẦN THIẾT
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// 3. ĐỒNG BỘ LỆNH SLASH COMMAND (/hi)
const commands = [
    new SlashCommandBuilder()
        .setName('hi')
        .setDescription('Gửi lời chào thân thiện đến bạn!')
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

client.once('ready', async () => {
    console.log(`🤖 Bot đã sẵn sàng! Đăng nhập dưới tên: ${client.user.tag}`);

    try {
        console.log('🔄 Đang đăng ký lệnh Slash Command (/)...');

        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands }
        );

        console.log('✅ Đã đồng bộ thành công lệnh /hi lên Discord!');
    } catch (error) {
        console.error('❌ Lỗi khi đồng bộ lệnh:', error);
    }
});

// 4. XỬ LÝ LỆNH /hi
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'hi') {
        const userName = interaction.user.displayName;

        await interaction.reply(
            `👋 Xin chào **${userName}**! Chúc bạn một ngày tốt lành!`
        );
    }
});

// 5. TỰ ĐỘNG LOG CHAT VÀ PHẢN HỒI KHI ĐƯỢC TAG
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const timestamp = new Date().toLocaleString('vi-VN');
    const serverName = message.guild ? message.guild.name : 'Tin nhắn riêng (DM)';
    const channelName = message.channel.name || 'DM';
    const authorName = message.author.username;
    const content = message.content;

    const logOutput =
        `[${timestamp}] [S: ${serverName}] [#${channelName}] ${authorName}: ${content}\n`;

    console.log(logOutput.trim());

    fs.appendFile('chat_logs.txt', logOutput, 'utf8', (err) => {
        if (err) {
            console.error('❌ Lỗi khi ghi file log:', err);
        }
    });

    // Xử lý khi bot được nhắc tên (tag/mention)
    if (message.mentions.has(client.user)) {
        // Loại bỏ phần tag bot khỏi tin nhắn
        const cleanContent = message.content.replace(new RegExp(`<@!?${client.user.id}>`, 'g'), '').trim();

        if (!cleanContent) {
            try {
                await message.reply(`<@${message.author.id}> Ơi! Mình nghe đây, bạn cần mình giúp gì nào? 🤖`);
            } catch (error) {
                console.error('❌ Lỗi khi gửi phản hồi rỗng:', error);
            }
            return;
        }

        const channelId = message.channel.id;

        // Đọc động system prompt từ file system_prompt.txt
        let currentSystemInstruction = "Bạn là trợ lý Discord.";
        try {
            if (fs.existsSync('system_prompt.txt')) {
                currentSystemInstruction = fs.readFileSync('system_prompt.txt', 'utf8');
            }
        } catch (error) {
            console.error('❌ Lỗi khi đọc file system_prompt.txt:', error);
        }

        // Lấy hoặc tạo mới chat session cho kênh này
        if (!activeChats.has(channelId)) {
            const newChat = ai.chats.create({
                model: 'gemini-3.5-flash-lite',
                config: {
                    systemInstruction: currentSystemInstruction,
                    tools: [searchDiscordTool]
                }
            });
            activeChats.set(channelId, newChat);
        }
        let chat = activeChats.get(channelId);

        // Hiện trạng thái "bot đang gõ..."
        await message.channel.sendTyping();

        try {
            // Gửi tin nhắn đến chat session
            let result;
            try {
                result = await chat.sendMessage({ message: cleanContent });
            } catch (chatError) {
                // Nếu gặp lỗi 400 (Bad Request - thường do lệch/hỏng lịch sử chat hoặc thought signature)
                if (chatError.status === 400 || String(chatError).includes('400')) {
                    console.warn(`⚠️ Lỗi 400 khi chat (lịch sử bị lỗi), đang reset Chat Session cho kênh ${channelId}...`);
                    chat = ai.chats.create({
                        model: 'gemini-3.5-flash-lite',
                        config: {
                            systemInstruction: currentSystemInstruction,
                            tools: [searchDiscordTool]
                        }
                    });
                    activeChats.set(channelId, chat);
                    result = await chat.sendMessage({ message: cleanContent });
                } else {
                    throw chatError;
                }
            }
            let filesToAttach = [];

            // Kiểm tra xem model có yêu cầu gọi hàm hay không
            if (result.functionCalls && result.functionCalls.length > 0) {
                const call = result.functionCalls[0];
                
                if (!message.guild) {
                    await message.reply("Hic, tính năng tra cứu chỉ hoạt động trong các Server Discord thôi bạn nhé!");
                    return;
                }

                let searchResults = [];
                if (call.name === 'searchForumPosts') {
                    const args = call.args;
                    console.log(`🔍 Gemini gọi hàm searchForumPosts với args:`, args);
                    searchResults = await searchForumPosts(message.guild, args.query, args.channelName);
                    console.log(`✅ Tìm thấy ${searchResults.length} bài viết khớp.`);
                } else if (call.name === 'searchDiscordFiles') {
                    const args = call.args;
                    console.log(`🔍 Gemini gọi hàm searchDiscordFiles với args:`, args);
                    searchResults = await searchDiscordFiles(message.guild, args.query, args.channelName);
                    console.log(`✅ Tìm thấy ${searchResults.length} file khớp.`);
                    filesToAttach = searchResults; // Lấy toàn bộ kết quả tìm kiếm để lọc theo dung lượng sau
                }

                // Gửi phản hồi hàm trở lại cho chat session
                result = await chat.sendMessage({
                    message: [
                        {
                            functionResponse: {
                                name: call.name,
                                response: { results: searchResults },
                                id: call.id
                            }
                        }
                    ]
                });
            }

            if (result && result.text) {
                // Giới hạn lịch sử lưu trữ để tránh quá tải token
                if (chat.history.length > MAX_HISTORY_LIMIT) {
                    let trimmedHistory = chat.history.slice(-MAX_HISTORY_LIMIT);
                    while (trimmedHistory.length > 0 && trimmedHistory[0].role !== 'user') {
                        trimmedHistory.shift();
                    }
                    chat.history = trimmedHistory;
                }

                // Cấu hình phản hồi tin nhắn và đính kèm file
                const MAX_UPLOAD_LIMIT = 25 * 1024 * 1024; // Giới hạn upload 25MB cho Discord message
                let currentTotalSize = 0;
                const physicalAttachments = [];
                const linkedFiles = [];

                for (const file of filesToAttach) {
                    // Nếu đính kèm thêm file này vẫn nằm trong giới hạn 25MB
                    if (currentTotalSize + file.fileSize <= MAX_UPLOAD_LIMIT) {
                        physicalAttachments.push(new AttachmentBuilder(file.fileUrl, { name: file.fileName }));
                        currentTotalSize += file.fileSize;
                    } else {
                        // Nếu vượt quá giới hạn, chuyển sang dạng link tải
                        linkedFiles.push(file);
                    }
                }

                let finalContent = `<@${message.author.id}> ${result.text}`;
                if (linkedFiles.length > 0) {
                    const linksText = linkedFiles.map(f => `- [${f.fileName}](${f.fileUrl})`).join('\n');
                    finalContent += `\n\n⚠️ *(Một số file vượt quá giới hạn bộ nhớ đệm tải lên nên mình gửi link tải tại đây nhé:)*\n${linksText}`;
                }

                const replyOptions = {
                    content: finalContent
                };

                if (physicalAttachments.length > 0) {
                    replyOptions.files = physicalAttachments;
                }

                try {
                    await message.reply(replyOptions);
                } catch (sendError) {
                    console.error('❌ Lỗi khi gửi file vật lý:', sendError);
                    // Fallback cuối cùng: Nếu có lỗi gì khác khi tải lên, gửi toàn bộ dưới dạng link tải để tránh lỗi bot
                    const allLinksText = filesToAttach.map(f => `- [${f.fileName}](${f.fileUrl})`).join('\n');
                    await message.reply({
                        content: `<@${message.author.id}> ${result.text}\n\n⚠️ *(Không thể đính kèm trực tiếp file vật lý do dung lượng quá lớn hoặc lỗi kết nối, bạn vui lòng tải qua link nhé:)*\n${allLinksText}`
                    });
                }
            } else {
                await message.reply(`<@${message.author.id}> Hic, mình nhận được phản hồi trống từ bộ não AI.`);
            }
        } catch (error) {
            console.error('❌ Lỗi khi gọi Gemini API:', error);
            await message.reply("Xin lỗi bạn, mình đang gặp chút trục trặc khi kết nối với bộ não AI! 🧠❌");
        }
    }
});

// 6. KHỞI ĐỘNG BOT
client.login(BOT_TOKEN);
