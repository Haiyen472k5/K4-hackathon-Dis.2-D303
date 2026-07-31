const fs = require('fs');
const path = require('path');

const LOG_FILE = path.resolve(__dirname, '../chat_logs.txt');

// 🛠️ Hàm tìm kiếm nhật ký cuộc trò chuyện trong chat_logs.txt theo từ khóa hoặc tên user
function searchChatLogs(query, maxResults = 30) {
    if (!fs.existsSync(LOG_FILE)) {
        return [];
    }

    try {
        const fileContent = fs.readFileSync(LOG_FILE, 'utf8');
        const lines = fileContent.split('\n').filter(line => line.trim());
        const queryLower = query.toLowerCase().trim();

        const matches = lines.filter(line => line.toLowerCase().includes(queryLower));
        return matches.slice(-maxResults);
    } catch (err) {
        console.error('❌ Lỗi khi tìm kiếm trong chat_logs.txt:', err.message);
        return [];
    }
}

// 🛠️ Hàm lấy toàn bộ lịch sử cuộc trò chuyện gần đây trong chat_logs.txt (tối đa N dòng)
function getRecentChatLogs(maxLines = 100) {
    if (!fs.existsSync(LOG_FILE)) {
        return '';
    }

    try {
        const fileContent = fs.readFileSync(LOG_FILE, 'utf8');
        const lines = fileContent.split('\n').filter(line => line.trim());
        return lines.slice(-maxLines).join('\n');
    } catch (err) {
        console.error('❌ Lỗi khi đọc chat_logs.txt:', err.message);
        return '';
    }
}

// 🛠️ Hàm quét lịch sử trò chuyện trực tiếp từ tất cả các kênh Text trong Discord Server
async function fetchServerChatHistory(guild, limitPerChannel = 20) {
    if (!guild) return '';

    let historyText = '';
    try {
        let channels;
        try {
            channels = await guild.channels.fetch();
        } catch (e) {
            channels = guild.channels.cache;
        }

        const textChannels = channels.filter(c => c && c.isTextBased && c.isTextBased() && c.type !== 2 && c.type !== 13);

        for (const [, channel] of textChannels) {
            try {
                const messages = await channel.messages.fetch({ limit: limitPerChannel }).catch(() => null);
                if (messages && messages.size > 0) {
                    historyText += `\n--- LỊCH SỬ CHAT TRONG KÊNH #${channel.name} ---\n`;
                    const sortedMsgs = Array.from(messages.values()).reverse();
                    for (const msg of sortedMsgs) {
                        if (!msg.content && msg.attachments.size === 0) continue;
                        const author = msg.author ? msg.author.username : 'User';
                        const time = msg.createdAt ? msg.createdAt.toLocaleTimeString('vi-VN') : '';
                        let text = msg.content ? msg.content.trim() : '';

                        if (msg.attachments.size > 0) {
                            const attNames = Array.from(msg.attachments.values()).map(a => a.name).join(', ');
                            text += ` [File: ${attNames}]`;
                        }

                        historyText += `[${time}] [#${channel.name}] ${author}: ${text}\n`;
                    }
                }
            } catch (err) {}
        }
    } catch (err) {
        console.error('❌ Lỗi fetch lịch sử chat từ Server:', err.message);
    }

    return historyText;
}

module.exports = {
    searchChatLogs,
    getRecentChatLogs,
    fetchServerChatHistory
};
