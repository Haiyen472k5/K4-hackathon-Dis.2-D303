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

    // A. Đọc danh sách kênh chat
    try {
        const chatFiles = fs.readdirSync(CHATS_DIR);
        if (chatFiles.length > 0) {
            result += `\n=== LỊCH SỬ CHAT CÁC KÊNH TRONG SERVER ===\n`;
            for (const file of chatFiles) {
                if (file.endsWith('.txt')) {
                    const channelName = file.replace('.txt', '');
                    const content = fs.readFileSync(path.join(CHATS_DIR, file), 'utf8');
                    const lines = content.trim().split('\n');
                    const recentLines = lines.slice(-20).join('\n'); // Lấy 20 tin nhắn gần nhất
                    result += `\n--- Kênh #${channelName} ---\n${recentLines}\n`;
                }
            }
        }
    } catch (e) {}

    // B. Đọc danh sách tài liệu PDF/Word
    try {
        const docFiles = fs.readdirSync(DOCS_DIR);
        if (docFiles.length > 0) {
            result += `\n=== LỊCH SỬ TÀI LIỆU & FILE TRONG SERVER ===\n`;
            for (const file of docFiles) {
                if (file.endsWith('.md')) {
                    const docContent = fs.readFileSync(path.join(DOCS_DIR, file), 'utf8');
                    result += `\n${docContent.substring(0, 1000)}\n`;
                }
            }
        }
    } catch (e) {}

    // C. Đọc danh sách link web & YouTube
    try {
        const linksFile = path.join(LINKS_DIR, 'web_and_youtube_links.md');
        if (fs.existsSync(linksFile)) {
            const linksContent = fs.readFileSync(linksFile, 'utf8');
            result += `\n=== LỊCH SỬ LINK WEB VÀ YOUTUBE ĐÃ CHIA SẺ ===\n${linksContent.substring(0, 1500)}\n`;
        }
    } catch (e) {}

    return result;
}

module.exports = {
    saveChannelChatMessage,
    saveDocumentHistory,
    saveWebLinkHistory,
    getLocalHistorySummary,
    CHATS_DIR,
    DOCS_DIR,
    LINKS_DIR
};
