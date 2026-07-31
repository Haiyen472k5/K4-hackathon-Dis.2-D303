const fs = require('fs');
const path = require('path');
const { CHATS_DIR, DOCS_DIR, LINKS_DIR, initHistoryDirs } = require('./historyManager');

/**
 * 🛠️ Phân loại Intent (Ý định) của câu hỏi người dùng
 * @param {string} queryText - Câu hỏi người dùng
 * @returns {'web' | 'file' | 'post' | 'all'}
 */
function detectQueryIntent(queryText) {
    if (!queryText) return 'all';
    const text = queryText.toLowerCase();

    const isWeb = /link|url|web|youtube|bài hát|ca sĩ|nhạc|video|trang web|b-ray|yt/i.test(text);
    const isFile = /file|tài liệu|pdf|doc|docx|sách|đính kèm|tệp/i.test(text);
    const isPost = /bài đăng|bài viết|chia sẻ|kênh|chat|thảo luận|forum|thread|ai nói|hạn|lịch|phòng|đáp án|mật khẩu|workshop/i.test(text);

    if (isWeb && !isFile && !isPost) return 'web';
    if (isFile && !isWeb && !isPost) return 'file';
    if (isPost && !isWeb && !isFile) return 'post';

    return 'all';
}

/**
 * 🛠️ Lấy dữ liệu Lịch sử được lọc thông minh theo Intent
 * @param {'web' | 'file' | 'post' | 'all'} intent 
 */
function getSelectiveHistorySummary(intent = 'all') {
    let result = '';

    // 1. BÀI ĐĂNG CHIA SẺ CHAT: Đọc TOÀN BỘ chat từ history/chats/
    if (intent === 'post' || intent === 'all') {
        try {
            const chatFiles = fs.readdirSync(CHATS_DIR);
            if (chatFiles.length > 0) {
                result += `\n=== BÀI ĐĂNG VÀ LỊCH SỬ CHAT CÁC KÊNH (ĐỌC CHI TIẾT) ===\n`;
                for (const file of chatFiles) {
                    if (file.endsWith('.txt')) {
                        const channelName = file.replace('.txt', '');
                        const content = fs.readFileSync(path.join(CHATS_DIR, file), 'utf8');
                        result += `\n--- Kênh #${channelName} ---\n${content.trim()}\n`;
                    }
                }
            }
        } catch (e) {}
    }

    // 2. FILE TÀI LIỆU: CHỈ đọc TÊN FILE & TIÊU ĐỀ (Không đọc chi tiết bên trong)
    if (intent === 'file' || intent === 'all') {
        try {
            const docFiles = fs.readdirSync(DOCS_DIR);
            if (docFiles.length > 0) {
                result += `\n=== DANH SÁCH FILE TÀI LIỆU TRONG SERVER (CHỈ ĐỌC TÊN FILE & TÓM TẮT) ===\n`;
                for (const file of docFiles) {
                    if (file.endsWith('.md')) {
                        const docContent = fs.readFileSync(path.join(DOCS_DIR, file), 'utf8');
                        const lines = docContent.trim().split('\n');
                        // Lấy 8 dòng đầu (Tên file, thời gian, link đính kèm, tóm tắt)
                        const headerExcerpt = lines.slice(0, 8).join('\n');
                        result += `\n${headerExcerpt}\n`;
                    }
                }
            }
        } catch (e) {}
    }

    // 3. LINK WEB & YOUTUBE: Đọc vắn tắt các ý chính
    if (intent === 'web' || intent === 'all') {
        try {
            const linksFile = path.join(LINKS_DIR, 'web_and_youtube_links.md');
            if (fs.existsSync(linksFile)) {
                const linksContent = fs.readFileSync(linksFile, 'utf8');
                result += `\n=== LINK WEB VÀ YOUTUBE (Ý CHÍNH & VẮN TẮT) ===\n${linksContent.trim()}\n`;
            }
        } catch (e) {}
    }

    return result;
}

module.exports = {
    detectQueryIntent,
    getSelectiveHistorySummary
};
