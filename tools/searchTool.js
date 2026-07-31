const { fetchAndExtractText } = require('./documentTool');

// 🛠️ Hàm lấy nội dung chi tiết bài đăng (Starter Message + Các tin nhắn + File đính kèm như .pdf, .doc, .docx)
async function getThreadContent(thread) {
    let fullText = '';
    try {
        const starter = await thread.fetchStarterMessage().catch(() => null);
        let msg = starter;

        if (!msg) {
            const messages = await thread.messages.fetch({ limit: 5 }).catch(() => null);
            if (messages && messages.size > 0) {
                msg = messages.last();
            }
        }

        if (msg) {
            if (msg.content && msg.content.trim()) {
                fullText += msg.content.trim() + '\n';
            }

            // Đọc các file đính kèm (.pdf, .doc, .docx, .txt, .md) trong tin nhắn
            if (msg.attachments && msg.attachments.size > 0) {
                for (const [, attachment] of msg.attachments) {
                    const ext = attachment.name.substring(attachment.name.lastIndexOf('.')).toLowerCase();
                    fullText += `\n[File đính kèm: "${attachment.name}"]`;
                    if (['.pdf', '.doc', '.docx', '.txt', '.md', '.json', '.csv'].includes(ext)) {
                        try {
                            const docText = await fetchAndExtractText(attachment.url, attachment.name);
                            if (docText && docText.trim()) {
                                fullText += `\n[Nội dung tài liệu đính kèm ${attachment.name}]:\n${docText.trim().substring(0, 3000)}\n`;
                            }
                        } catch (err) {
                            console.error(`❌ Lỗi đọc file đính kèm ${attachment.name}:`, err.message);
                        }
                    }
                }
            }
        }
    } catch (e) {
        console.error(`❌ Không thể đọc nội dung thread ${thread.name}:`, e.message);
    }
    return fullText.trim();
}

// 🛠️ Module tìm kiếm từ khóa trong các bài đăng & tài nguyên thuộc server
async function searchThreadsByKeyword(guild, query) {
    if (!guild) {
        throw new Error('Cần thông tin Server (Guild) để thực hiện tìm kiếm!');
    }

    let channels;
    try {
        channels = await guild.channels.fetch();
    } catch (e) {
        channels = guild.channels.cache;
    }

    const keywords = ['chia-sẻ', 'chia-se', 'tài-nguyên', 'tai-nguyen', 'tai_nguyen', 'tài nguyên', 'tai nguyen', 'doc', 'resource'];
    let matchedChannels = channels.filter(c => c && c.name && keywords.some(k => c.name.toLowerCase().includes(k)));

    // Nếu không khớp kênh chia-sẻ/tài-nguyên thì lấy tất cả các kênh văn bản trong server
    if (!matchedChannels || matchedChannels.size === 0) {
        matchedChannels = channels.filter(c => c && c.type !== 4 && c.type !== 2 && c.type !== 13);
    }

    let allThreads = [];

    for (const [, channel] of matchedChannels) {
        if (channel.threads) {
            try {
                const activeThreads = await channel.threads.fetchActive().catch(() => ({ threads: new Map() }));
                const archivedThreads = await channel.threads.fetchArchived().catch(() => ({ threads: new Map() }));
                allThreads.push(...activeThreads.threads.values(), ...archivedThreads.threads.values());
            } catch (e) {}
        }
    }

    const queryLower = query.toLowerCase().trim();
    const results = [];

    for (const t of allThreads) {
        let isMatch = t.name.toLowerCase().includes(queryLower);
        if (!isMatch) {
            // Quét sâu vào nội dung tin nhắn bên trong thread
            const content = await getThreadContent(t);
            if (content && content.toLowerCase().includes(queryLower)) {
                isMatch = true;
            }
        }
        if (isMatch) {
            results.push(t);
        }
    }

    return results;
}

module.exports = {
    searchThreadsByKeyword,
    getThreadContent
};
