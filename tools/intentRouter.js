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
 * 🛠️ Lấy dữ liệu Lịch sử đầy đủ và chính xác 100% từ đĩa cứng history/
 */
function getSelectiveHistorySummary(intent = 'all') {
    let result = '';

    // 1. LỊCH SỬ CHAT CÁC KÊNH DISCORD
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

    // 2. TOÀN BỘ NỘI DUNG TÀI LIỆU PDF/WORD/MD TRONG SERVER
    try {
        const docFiles = fs.readdirSync(DOCS_DIR);
        if (docFiles.length > 0) {
            result += `\n=== TOÀN BỘ NỘI DUNG TÀI LIỆU VÀ BÀI ĐĂNG FILE TRONG SERVER ===\n`;
            for (const file of docFiles) {
                if (file.endsWith('.md')) {
                    const docContent = fs.readFileSync(path.join(DOCS_DIR, file), 'utf8');
                    result += `\n${docContent.trim()}\n`;
                }
            }
        }
    } catch (e) {}

    // 3. LINK WEB & YOUTUBE
    try {
        const linksFile = path.join(LINKS_DIR, 'web_and_youtube_links.md');
        if (fs.existsSync(linksFile)) {
            const linksContent = fs.readFileSync(linksFile, 'utf8');
            result += `\n=== LINK WEB VÀ YOUTUBE (Ý CHÍNH & VẮN TẮT) ===\n${linksContent.trim()}\n`;
        }
    } catch (e) {}

    return result;
}

module.exports = {
    detectQueryIntent,
    getSelectiveHistorySummary
};
