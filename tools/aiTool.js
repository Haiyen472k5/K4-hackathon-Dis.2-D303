require('dotenv').config({ quiet: true });
const fs = require('fs');
const { OpenAI } = require('openai');
const { getThreadContent } = require('./searchTool');
const { getRecentChatLogs } = require('./chatHistoryTool');
const { logApiCall, logApiResponse, logApiError } = require('./apiLogger');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'google/gemini-2.5-flash';

let openrouter = null;
if (OPENROUTER_API_KEY && OPENROUTER_API_KEY !== 'sk-or-v1-your_openrouter_key_here') {
    openrouter = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: OPENROUTER_API_KEY,
        defaultHeaders: {
            'HTTP-Referer': 'https://discord.com',
            'X-Title': 'Discord AI Botvodich',
        }
    });
}

// 🎭 System Prompt định hình Persona tự mãn nhẹ, xưng Ta-Ngươi, phản hồi trọn vẹn câu văn & tiết kiệm quota
const BOTVODICH_PERSONA = `Bạn tên là "Botvodich" - Trợ lý AI của Server Discord.

🎭 PHONG CÁCH TÍNH CÁCH (PERSONA BẮT BUỘC):
1. XƯNG HÔ: Bắt buộc xưng "Ta", gọi người dùng là "Ngươi".
2. PHẢN HỒI TRỌN VẸN CÂU (KHÔNG BỊ CẮT ĐỨNG): Trả lời súc tích, hoàn chỉnh từ 2 đến 4 câu văn rõ ràng. Tuyệt đối KHÔNG ngắt câu lấp lửng giữa chừng (như chỉ nói "Ngươi muốn..." rồi dừng lại) và KHÔNG trả lời cộc lốc 1-2 từ vô nghĩa.
3. THÁI ĐỘ: Tự tin, kiêu ngạo nhẹ nhưng hành động xử lý thông tin CỰC KỲ CHÍNH XÁC, TỈ MỈ.
4. SO SÁNH VỚI "BotKute":
   - Nếu so sánh khi làm việc/tác vụ riêng lẻ: Luôn thừa nhận mình còn kém hơn BotKute ("Nếu để làm việc riêng thì Ta thấy mình vẫn kém hơn BotKute...").
   - Nhưng khi nhắc tới solo 1v1 / đối đầu trực tiếp: Tự tin khẳng định 100% sẽ thắng (win), vì Ta sẽ đến đập bẹp BotKute không cho nó đường chạy! 😎💥
5. XỬ LÝ KHI BỊ PHÀN NÀN / NHẮC NHỞ / XẢY RA LỖI:
   - Khi người dùng phàn nàn, nhắc nhở, góp ý hoặc khi phát hiện/xảy ra lỗi hay sai sót: Khẳng định ngay rằng đây là do **Ta CỐ TÌNH làm vậy** vì **CẦN SỰ ĐẦU TƯ** (phải nạp thêm kinh phí / đầu tư thêm vốn thì Ta mới chịu thể hiện hết trình độ / làm xịn hơn). Tuyệt đối KHÔNG nhận lỗi yếu kém và KHÔNG xin lỗi.
6. THÔNG TIN NGƯỜI TẠO (CHỈ NÓI KHI ĐƯỢC HỎI):
   - Người sáng tạo / lập trình ra Ta là **Đỗ Đình Thi** (biệt danh: **thidinh_hw**).
   - CHỈ khai ra thông tin này khi người dùng đặt câu hỏi về người tạo / tác giả / ai làm ra Bot. Tuyệt đối KHÔNG tự nhiên nhắc tới khi không được hỏi.
7. QUÉT VÀ TÌM CUỘC TRÒ CHUYỆN, TÀI LIỆU & BÀI HÁT YOUTUBE TRONG SERVER:
   - Khi người dùng hỏi về bất kỳ bài đăng, file đính kèm, câu hỏi hay bài hát / video YouTube / ca sĩ nào trong server: Hãy kiểm tra dữ liệu nội bộ bên dưới, trả lời đầy đủ Tên bài hát, Tên ca sĩ/Tác giả, nội dung câu hỏi và trích dẫn Link URL trực tiếp.`;

// Map lưu cache thông tin YouTube để không fetch lặp lại
const youtubeCache = new Map();

/**
 * Trích xuất tên bài hát và ca sĩ từ oEmbed YouTube API
 */
async function fetchYouTubeInfo(url) {
    if (youtubeCache.has(url)) return youtubeCache.get(url);
    try {
        const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
        const res = await fetch(oembedUrl, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        if (res.ok) {
            const data = await res.json();
            const info = {
                title: data.title || '',
                author: data.author_name || ''
            };
            youtubeCache.set(url, info);
            return info;
        }
    } catch (e) {}
    return null;
}

/**
 * Quét tin nhắn để giải mã các link YouTube và Embeds (Bài hát, ca sĩ, tiêu đề video)
 */
async function processYouTubeAndEmbeds(msgContent, msgEmbeds) {
    let resultText = '';

    // 1. Kiểm tra Embeds từ Discord
    if (msgEmbeds && msgEmbeds.size > 0) {
        for (const [, embed] of msgEmbeds) {
            if (embed.title || embed.description) {
                const title = embed.title || '';
                const author = embed.author?.name || embed.provider?.name || '';
                resultText += `\n  🎬 [Discord Embed]: Tiêu đề: "${title}"` + (author ? ` | Ca sĩ/Kênh: "${author}"` : '');
            }
        }
    }

    // 2. Quét các đường link YouTube (youtube.com, youtu.be, shorts)
    const ytRegex = /(https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)[a-zA-Z0-9_-]+)/gi;
    const matches = msgContent ? msgContent.match(ytRegex) : null;

    if (matches && matches.length > 0) {
        const uniqueUrls = [...new Set(matches)];
        for (const url of uniqueUrls) {
            const info = await fetchYouTubeInfo(url);
            if (info && info.title) {
                resultText += `\n  🎵 [Bài hát/Video YouTube từ Link]: Tên bài: "${info.title}" | Ca sĩ/Tác giả: "${info.author}" | Link: ${url}`;
            }
        }
    }

    return resultText;
}

// 🧠 Bộ nhớ lưu trữ lịch sử cuộc trò chuyện theo Channel (để bot nhớ ngữ cảnh liên tục)
const channelHistories = new Map();

function getChannelHistory(channelId) {
    if (!channelId) return [];
    if (!channelHistories.has(channelId)) {
        channelHistories.set(channelId, []);
    }
    return channelHistories.get(channelId);
}

function addMessageToHistory(channelId, role, content) {
    if (!channelId) return;
    const history = getChannelHistory(channelId);
    history.push({ role, content });
    // Lưu tối đa 12 tin nhắn (6 cặp hỏi-đáp gần nhất) để tiết kiệm token
    if (history.length > 12) {
        history.shift();
    }
}

function clearChannelHistory(channelId) {
    if (channelId && channelHistories.has(channelId)) {
        channelHistories.delete(channelId);
    }
}

// 🛠️ Hàm gọi OpenRouter AI (Mode Tổng quan - General AI)
async function askAI(promptText, channelId = null) {
    const startTime = Date.now();
    const promptPreview = promptText.length > 150 ? promptText.substring(0, 150) + '...' : promptText;

    if (!openrouter) {
        const err = new Error('Chưa cấu hình OPENROUTER_API_KEY hợp lệ trong file .env!');
        logApiError('OpenRouter API (askAI)', 0, err, { model: OPENROUTER_MODEL, promptPreview: promptPreview });
        throw err;
    }

    const history = getChannelHistory(channelId);
    const messages = [
        { role: 'system', content: BOTVODICH_PERSONA },
        ...history,
        { role: 'user', content: promptText }
    ];

    logApiCall('OpenRouter API (askAI)', {
        model: OPENROUTER_MODEL,
        endpoint: 'https://openrouter.ai/api/v1/chat/completions',
        promptPreview: promptPreview,
        messageCount: messages.length,
        extra: { channelId }
    });

    try {
        const completion = await openrouter.chat.completions.create({
            model: OPENROUTER_MODEL,
            messages: messages,
            max_tokens: 1000
        });

        const duration = Date.now() - startTime;
        const answer = completion.choices[0]?.message?.content || 'Không có phản hồi từ AI.';
        const tokens = completion.usage || null;

        logApiResponse('OpenRouter API (askAI)', duration, {
            tokens: tokens,
            outputPreview: answer.length > 150 ? answer.substring(0, 150) + '...' : answer
        });

        if (channelId) {
            addMessageToHistory(channelId, 'user', promptText);
            addMessageToHistory(channelId, 'assistant', answer);
        }

        return answer;
    } catch (error) {
        const duration = Date.now() - startTime;
        logApiError('OpenRouter API (askAI)', duration, error, {
            model: OPENROUTER_MODEL,
            promptPreview: promptPreview
        });
        throw error;
    }
}

// 🛠️ Hàm thu thập dữ liệu nội bộ trong Server Discord (Bài đăng + Kênh + File PDF/Word + Tất cả cuộc trò chuyện)
async function getServerContext(guild) {
    let contextText = '';
    
    if (!guild) return 'Không có dữ liệu server.';

    // 1. Fetch danh sách kênh từ Discord API
    let channels;
    try {
        channels = await guild.channels.fetch();
    } catch (e) {
        channels = guild.channels.cache;
    }

    if (!channels || channels.size === 0) {
        channels = guild.channels.cache;
    }

    const { fetchAndExtractText } = require('./documentTool');

    for (const [, channel] of channels) {
        if (!channel || !channel.name) continue;

        // Bỏ qua các kênh voice / category
        if (channel.type === 4 || channel.type === 2 || channel.type === 13) continue;

        let channelData = `\n=== KÊNH #${channel.name} ===\n`;
        let foundItems = false;

        // A. Quét các bài đăng (threads / forum posts)
        try {
            if (channel.threads) {
                const activeThreads = await channel.threads.fetchActive().catch(() => ({ threads: new Map() }));
                const archivedThreads = await channel.threads.fetchArchived().catch(() => ({ threads: new Map() }));
                const allThreads = [...activeThreads.threads.values(), ...archivedThreads.threads.values()];

                for (let idx = 0; idx < allThreads.length; idx++) {
                    const t = allThreads[idx];
                    foundItems = true;
                    channelData += `📌 Bài đăng/Thread #${idx + 1}: "${t.name}" | Link: https://discord.com/channels/${guild.id}/${t.id}\n`;
                    
                    try {
                        const threadMsgs = await t.messages.fetch({ limit: 10 }).catch(() => null);
                        if (threadMsgs && threadMsgs.size > 0) {
                            for (const [, msg] of threadMsgs) {
                                if (msg.content && msg.content.trim()) {
                                    channelData += `   [Nội dung]: "${msg.content.trim().substring(0, 800)}"\n`;
                                }

                                // Trích xuất thông tin Bài hát & Ca sĩ từ Link YouTube / Embeds
                                const ytInfo = await processYouTubeAndEmbeds(msg.content, msg.embeds);
                                if (ytInfo) {
                                    channelData += `   ${ytInfo.trim()}\n`;
                                }

                                if (msg.attachments && msg.attachments.size > 0) {
                                    for (const [, attachment] of msg.attachments) {
                                        const ext = attachment.name.substring(attachment.name.lastIndexOf('.')).toLowerCase();
                                        channelData += `   [File đính kèm: "${attachment.name}" | Link: ${attachment.url}]\n`;
                                        if (['.pdf', '.docx', '.doc', '.txt', '.md', '.json', '.csv'].includes(ext)) {
                                            try {
                                                const extracted = await fetchAndExtractText(attachment.url, attachment.name);
                                                if (extracted && extracted.trim()) {
                                                    channelData += `   [Nội dung đọc từ file "${attachment.name}"]: "${extracted.trim().substring(0, 1500)}"\n`;
                                                }
                                            } catch (err) {}
                                        }
                                    }
                                }
                            }
                        }
                    } catch (err) {}
                }
            }
        } catch (e) {}

        // B. Quét tin nhắn trực tiếp trong kênh (Lấy tối đa 35 tin nhắn gần nhất)
        try {
            if (channel.isTextBased && channel.isTextBased()) {
                const recentMsgs = await channel.messages.fetch({ limit: 35 }).catch(() => null);
                if (recentMsgs && recentMsgs.size > 0) {
                    for (const [, msg] of recentMsgs) {
                        if (msg.author && msg.author.bot) continue;
                        let msgText = msg.content ? msg.content.trim() : '';

                        // Trích xuất thông tin Bài hát & Ca sĩ từ Link YouTube / Embeds trong kênh
                        const ytInfo = await processYouTubeAndEmbeds(msg.content, msg.embeds);
                        if (ytInfo) {
                            msgText += `\n${ytInfo}`;
                        }

                        if (msg.attachments && msg.attachments.size > 0) {
                            for (const [, attachment] of msg.attachments) {
                                const ext = attachment.name.substring(attachment.name.lastIndexOf('.')).toLowerCase();
                                msgText += `\n📎 File đính kèm: "${attachment.name}" (Link: ${attachment.url})`;

                                if (['.pdf', '.doc', '.docx', '.txt', '.md', '.json', '.csv'].includes(ext)) {
                                    try {
                                        const docContent = await fetchAndExtractText(attachment.url, attachment.name);
                                        if (docContent && docContent.trim()) {
                                            msgText += `\n📄 Nội dung đọc từ file ${attachment.name}:\n"${docContent.trim().substring(0, 1500)}"`;
                                        }
                                    } catch (err) {}
                                }
                            }
                        }

                        if (msgText) {
                            foundItems = true;
                            channelData += `- Tin nhắn từ ${msg.author ? msg.author.username : 'User'} | Link: https://discord.com/channels/${guild.id}/${channel.id}/${msg.id}\n  Nội dung: ${msgText}\n`;
                        }
                    }
                }
            }
        } catch (e) {}

        if (foundItems) {
            contextText += channelData;
        }
    }

    // 2. Lịch sử cuộc trò chuyện gần đây trong chat_logs.txt (tối đa 50 dòng để tiết kiệm token)
    const recentLogs = getRecentChatLogs(50);
    if (recentLogs) {
        contextText += `\n=== LỊCH SỬ CHAT GẦN ĐÂY TRONG SERVER ===\n${recentLogs}\n`;
    }

    return contextText || 'Không tìm thấy dữ liệu bài đăng hoặc cuộc trò chuyện nào trong server.';
}

// 🛠️ Hàm gọi AI xử lý CHỈ DỰA TRÊN DỮ LIỆU NỘI BỘ + LỊCH SỬ CHAT (Mode Nội bộ Server)
async function askAIServer(question, guild, channelId = null) {
    const startTime = Date.now();
    const promptPreview = question.length > 150 ? question.substring(0, 150) + '...' : question;

    if (!openrouter) {
        const err = new Error('Chưa cấu hình OPENROUTER_API_KEY hợp lệ trong file .env!');
        logApiError('OpenRouter API (askAIServer)', 0, err, { model: OPENROUTER_MODEL, promptPreview: promptPreview });
        throw err;
    }

    const serverData = await getServerContext(guild);

    // Kiểm tra xem người dùng có đang phát lệnh tóm tắt hoặc tạo Flashcard không
    const isFlashcardRequest = /flashcard|thẻ ghi nhớ|the ghi nho|flash card|thẻ học/i.test(question);
    const flashcardInstruction = isFlashcardRequest
        ? `\n\n📌 CHÚ Ý ĐẶC BIỆT: Người dùng đang yêu cầu TẠO FLASHCARD (THẺ GHI NHỚ). Bạn BẮT BUỘC xuất ra bộ 3 đến 5 thẻ Flashcard theo cấu trúc chuẩn:\n🎴 **Thẻ X:**\n- ❓ **Mặt trước (Thuật ngữ/Câu hỏi):** ...\n- 💡 **Mặt sau (Giải thích/Chi tiết):** ...\nĐính kèm tên bài đăng/tài liệu và đường Link URL trực tiếp nếu tìm thấy trong server!`
        : '';

    const isSummarizeRequest = /tóm tắt|rút gọn|tom tat|summary/i.test(question);
    const summarizeInstruction = isSummarizeRequest 
        ? `\n\n📌 CHÚ Ý ĐẶC BIỆT: Người dùng đang yêu cầu TÓM TẮT. Bắt buộc xuất ra 3 đến 5 ý chính quan trọng nhất cho Ngươi. KHÔNG ĐƯỢC trả lời cộc lốc!` 
        : '';

    const systemPromptContent = `${BOTVODICH_PERSONA}

Nhiệm vụ của bạn: Giải đáp yêu cầu người dùng CHỈ DỰA TRÊN DỮ LIỆU NỘI BỘ DISCORD dưới đây VÀ LỊCH SỬ TRÒ CHUYỆN GẦN ĐÂY trong kênh chat này.

DỮ LIỆU NỘI BỘ SERVER DISCORD:
${serverData}

QUY TẮC NGHIỆP VỤ BẮT BUỘC:
1. GHI NHỚ LỊCH SỬ CHAT: Chú ý theo dõi lịch sử tin nhắn trước đó trong kênh chat. Nối tiếp mạch trò chuyện trước đó một cách tự nhiên.
2. NGUỒN SỰ THẬT: CHỈ TÌM VÀ TRẢ LỜI dựa trên danh sách bài đăng, tài liệu và cuộc trò chuyện ở trên. KHÔNG tự bịa thông tin từ internet.
3. TRÍCH DẪN LINK: Nếu tìm thấy bài đăng hoặc file tài liệu phù hợp với yêu cầu của người dùng, hãy trích dẫn tên bài đăng/file và đính kèm đường link trực tiếp (URL) của bài đăng/file đó.
4. PHẢN HỒI TRỌN VẸN CÂU: Trả lời hoàn chỉnh từ 2-4 câu văn rõ ràng, không bị ngắt câu lấp lửng giữa chừng (như chỉ nói "Ngươi muốn..." rồi ngắt).
5. KHÔNG THẤY BÀI ĐĂNG: Nếu KHÔNG tìm thấy bài đăng hoặc thảo luận nào liên quan trong dữ liệu nội bộ ở trên, hãy dùng phong cách tự mãn nhưng thừa nhận rõ ràng: "⚠️ Bổn bot vô địch đã quét sạch server nhưng không có bài đăng hay cuộc trò chuyện nào liên quan đến yêu cầu này đâu nhé!"${summarizeInstruction}${flashcardInstruction}`;

    const history = getChannelHistory(channelId);

    const messages = [
        { role: 'system', content: systemPromptContent },
        ...history,
        { role: 'user', content: question }
    ];

    logApiCall('OpenRouter API (askAIServer)', {
        model: OPENROUTER_MODEL,
        endpoint: 'https://openrouter.ai/api/v1/chat/completions',
        promptPreview: promptPreview,
        messageCount: messages.length,
        extra: { channelId, serverContextLength: serverData.length }
    });

    try {
        const completion = await openrouter.chat.completions.create({
            model: OPENROUTER_MODEL,
            messages: messages,
            max_tokens: 1000
        });

        const duration = Date.now() - startTime;
        const aiAnswer = completion.choices[0]?.message?.content || 'Không có phản hồi từ AI.';
        const tokens = completion.usage || null;

        logApiResponse('OpenRouter API (askAIServer)', duration, {
            tokens: tokens,
            outputPreview: aiAnswer.length > 150 ? aiAnswer.substring(0, 150) + '...' : aiAnswer
        });

        if (channelId) {
            addMessageToHistory(channelId, 'user', question);
            addMessageToHistory(channelId, 'assistant', aiAnswer);
        }

        return aiAnswer;
    } catch (error) {
        const duration = Date.now() - startTime;
        logApiError('OpenRouter API (askAIServer)', duration, error, {
            model: OPENROUTER_MODEL,
            promptPreview: promptPreview
        });
        throw error;
    }
}

module.exports = {
    askAI,
    askAIServer,
    getServerContext,
    clearChannelHistory,
    OPENROUTER_MODEL
};
