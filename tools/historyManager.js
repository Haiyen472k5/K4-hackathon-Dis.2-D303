const fs = require('fs');
const path = require('path');

const HISTORY_BASE_DIR = path.resolve(__dirname, '../history');
const CHATS_DIR = path.join(HISTORY_BASE_DIR, 'chats');
const DOCS_DIR = path.join(HISTORY_BASE_DIR, 'documents');
const LINKS_DIR = path.join(HISTORY_BASE_DIR, 'web_links');

// 🛠️ Tự động khởi tạo các thư mục lưu trữ history nếu chưa tồn tại
function initHistoryDirs() {
    [HISTORY_BASE_DIR, CHATS_DIR, DOCS_DIR, LINKS_DIR].forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    });
}

initHistoryDirs();

// Chuẩn hóa tên file an toàn cho hệ điều hành
function sanitizeFileName(name) {
    if (!name) return 'unnamed';
    return name.replace(/[/\\?%*:|"<>]/g, '_').replace(/\s+/g, '_').toLowerCase();
}

/**
 * 1. Lưu tin nhắn chat theo từng Kênh Discord
 */
function saveChannelChatMessage(channelName, authorName, content, timestamp = new Date()) {
    try {
        initHistoryDirs();
        const safeChannelName = sanitizeFileName(channelName || 'general');
        const filePath = path.join(CHATS_DIR, `${safeChannelName}.txt`);
        
        const timeStr = timestamp.toLocaleString('vi-VN');
        const logLine = `[${timeStr}] ${authorName}: ${content}\n`;
        
        fs.appendFileSync(filePath, logLine, 'utf8');
    } catch (err) {
        console.error('❌ Lỗi lưu Chat History:', err.message);
    }
}

/**
 * 2. Lưu tài liệu (Word, PDF, Text) + Tóm tắt ý chính
 */
function saveDocumentHistory(docName, fileUrl, rawContent, summaryText = '') {
    try {
        initHistoryDirs();
        const safeDocName = sanitizeFileName(docName || 'document');
        const filePath = path.join(DOCS_DIR, `${safeDocName}.md`);

        const timeStr = new Date().toLocaleString('vi-VN');
        const mdContent = `# TÀI LIỆU: ${docName}\n\n` +
            `- **Thời gian lưu:** ${timeStr}\n` +
            `- **URL đính kèm:** ${fileUrl || 'N/A'}\n\n` +
            `## TÓM TẮT Ý CHÍNH\n${summaryText || 'Chưa có tóm tắt'}\n\n` +
            `## NỘI DUNG CHI TIẾT TRÍCH XUẤT\n\`\`\`text\n${rawContent || ''}\n\`\`\`\n`;

        fs.writeFileSync(filePath, mdContent, 'utf8');
        console.log(`💾 Đã lưu history tài liệu: ${filePath}`);
    } catch (err) {
        console.error('❌ Lỗi lưu Document History:', err.message);
    }
}

/**
 * 3. Lưu Link Web / YouTube + Tóm tắt nội dung
 */
function saveWebLinkHistory(linkUrl, title = '', author = '', summaryText = '') {
    try {
        initHistoryDirs();
        const filePath = path.join(LINKS_DIR, 'web_and_youtube_links.md');
        const jsonPath = path.join(LINKS_DIR, 'links_index.json');

        const timeStr = new Date().toLocaleString('vi-VN');
        const mdEntry = `\n### 🔗 Link: ${title || linkUrl}\n` +
            `- **URL:** ${linkUrl}\n` +
            `- **Tác giả / Kênh:** ${author || 'N/A'}\n` +
            `- **Thời gian lưu:** ${timeStr}\n` +
            `- **Tóm tắt nội dung:** ${summaryText || title || 'Link được chia sẻ trong server'}\n` +
            `---\n`;

        fs.appendFileSync(filePath, mdEntry, 'utf8');

        // Cập nhật JSON index
        let linksList = [];
        if (fs.existsSync(jsonPath)) {
            try {
                linksList = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
            } catch (e) {
                linksList = [];
            }
        }
        linksList.push({
            url: linkUrl,
            title: title,
            author: author,
            summary: summaryText,
            timestamp: timeStr
        });
        fs.writeFileSync(jsonPath, JSON.stringify(linksList, null, 2), 'utf8');

        console.log(`💾 Đã lưu history link web/YouTube: ${linkUrl}`);
    } catch (err) {
        console.error('❌ Lỗi lưu Web Link History:', err.message);
    }
}

/**
 * 4. Đọc toàn bộ dữ liệu History cục bộ từ đĩa cứng (dùng để trả lời siêu nhanh)
 */
function getLocalHistorySummary() {
    initHistoryDirs();
    let result = '';

    // A. Đọc toàn bộ lịch sử chat các kênh (lưu trọn vẹn)
    try {
        const chatFiles = fs.readdirSync(CHATS_DIR);
        if (chatFiles.length > 0) {
            result += `\n=== LỊCH SỬ CHAT CÁC KÊNH TRONG SERVER ===\n`;
            for (const file of chatFiles) {
                if (file.endsWith('.txt')) {
                    const channelName = file.replace('.txt', '');
                    const content = fs.readFileSync(path.join(CHATS_DIR, file), 'utf8');
                    result += `\n--- Kênh #${channelName} ---\n${content.trim()}\n`;
                }
            }
        }
    } catch (e) {}

    // B. Đọc toàn bộ văn bản trích xuất từ tài liệu PDF/Word (lưu trọn vẹn)
    try {
        const docFiles = fs.readdirSync(DOCS_DIR);
        if (docFiles.length > 0) {
            result += `\n=== TOÀN BỘ NỘI DUNG TÀI LIỆU PDF/WORD TRONG SERVER ===\n`;
            for (const file of docFiles) {
                if (file.endsWith('.md')) {
                    const docContent = fs.readFileSync(path.join(DOCS_DIR, file), 'utf8');
                    result += `\n${docContent.trim()}\n`;
                }
            }
        }
    } catch (e) {}

    // C. Đọc danh sách link web & YouTube (chỉ lưu vắn tắt ý chính)
    try {
        const linksFile = path.join(LINKS_DIR, 'web_and_youtube_links.md');
        if (fs.existsSync(linksFile)) {
            const linksContent = fs.readFileSync(linksFile, 'utf8');
            result += `\n=== VẮN TẮT Ý CHÍNH CÁC LINK WEB VÀ YOUTUBE ===\n${linksContent.trim()}\n`;
        }
    } catch (e) {}

    return result;
}

/**
 * 5. Tự động đồng bộ toàn bộ lịch sử quá khứ trong Server Discord xuống thư mục history/ khi bot khởi động
 */
async function syncAllServerHistoryToDisk(client) {
    if (!client || !client.guilds) return;
    console.log('🔄 Đang tự động quét và đồng bộ lịch sử tin nhắn, tài liệu và links từ Server Discord...');

    const { fetchAndExtractText } = require('./documentTool');

    for (const [, guild] of client.guilds.cache) {
        let channels;
        try {
            channels = await guild.channels.fetch();
        } catch (e) {
            channels = guild.channels.cache;
        }

        if (!channels) continue;

        for (const [, channel] of channels) {
            if (!channel || !channel.name) continue;
            // Bỏ qua kênh voice, category
            if (channel.type === 4 || channel.type === 2 || channel.type === 13) continue;

            try {
                if (channel.isTextBased && channel.isTextBased()) {
                    const recentMsgs = await channel.messages.fetch({ limit: 50 }).catch(() => null);
                    if (recentMsgs && recentMsgs.size > 0) {
                        const msgsArray = Array.from(recentMsgs.values()).reverse(); // Xếp theo thứ tự thời gian tăng dần
                        
                        for (const msg of msgsArray) {
                            if (!msg || !msg.author || msg.author.bot) continue;
                            const authorName = msg.author.displayName || msg.author.username;
                            const content = msg.content || '';

                            // A. Lưu chat history theo kênh
                            if (content.trim()) {
                                saveChannelChatMessage(channel.name, authorName, content, msg.createdAt);
                            }

                            // B. Quét & Lưu link YouTube / Web
                            const ytRegex = /(https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)[a-zA-Z0-9_-]+)/gi;
                            const matches = content.match(ytRegex);
                            if (matches && matches.length > 0) {
                                for (const url of matches) {
                                    saveWebLinkHistory(url, `Video YouTube trong #${channel.name}`, authorName, `Được chia sẻ bởi ${authorName} trong kênh #${channel.name}`);
                                }
                            }

                            // C. Quét & Lưu File đính kèm (PDF, DOCX, TXT...)
                            if (msg.attachments && msg.attachments.size > 0) {
                                for (const [, attachment] of msg.attachments) {
                                    const ext = attachment.name.substring(attachment.name.lastIndexOf('.')).toLowerCase();
                                    if (['.pdf', '.doc', '.docx', '.txt', '.md', '.json', '.csv'].includes(ext)) {
                                        try {
                                            const docText = await fetchAndExtractText(attachment.url, attachment.name);
                                            if (docText && docText.trim()) {
                                                saveDocumentHistory(attachment.name, attachment.url, docText.trim(), `Tải lên bởi ${authorName} trong kênh #${channel.name}`);
                                            }
                                        } catch (err) {}
                                    }
                                }
                            }
                        }
                    }
                }
            } catch (err) {
                console.error(`❌ Lỗi quét kênh #${channel.name}:`, err.message);
            }
        }
    }

    console.log('✅ Hoàn tất đồng bộ toàn bộ lịch sử Server Discord xuống thư mục history/!');
}

module.exports = {
    saveChannelChatMessage,
    saveDocumentHistory,
    saveWebLinkHistory,
    getLocalHistorySummary,
    syncAllServerHistoryToDisk,
    CHATS_DIR,
    DOCS_DIR,
    LINKS_DIR
};
