const { askAI, askAIServer, getServerContext } = require('./aiTool');
const { fetchAndExtractText, extractTextFromBuffer } = require('./documentTool');
const fs = require('fs');
const path = require('path');

/**
 * Hàm tạo Flashcard từ đoạn văn bản hoặc tài liệu thô bằng OpenRouter AI
 */
async function generateFlashcardsFromText(rawText, title = 'Tài liệu', count = 5) {
    if (!rawText || !rawText.trim()) {
        throw new Error('Nội dung văn bản trống, không thể tạo Flashcard!');
    }

    const trimmedText = rawText.trim().substring(0, 8000);

    const prompt = `Bạn là chuyên gia thiết kế Flashcard học tập xuất sắc. Hãy tạo một bộ ${count} thẻ Flashcard chất lượng cao từ nội dung bên dưới.

TIÊU ĐỀ TÀI LIỆU: "${title}"
NỘI DUNG VĂN BẢN:
"""
${trimmedText}
"""

YÊU CẦU ĐỊNH DẠNG BẮT BUỘC (Xuất ra đúng cấu trúc Markdown này):
📇 **BỘ FLASHCARD HỌC TẬP: ${title.toUpperCase()}**
*(Được tổng hợp tự động bởi Botvodich)*

🎴 **Thẻ 1:**
- ❓ **Mặt trước (Khái niệm / Câu hỏi):** [Nêu thuật ngữ hoặc câu hỏi ngắn gọn]
- 💡 **Mặt sau (Giải thích / Ý chính):** [Nêu định nghĩa, câu trả lời hoặc 2-3 ý cốt lõi]

🎴 **Thẻ 2:**
- ❓ **Mặt trước (Khái niệm / Câu hỏi):** [Nêu thuật ngữ hoặc câu hỏi ngắn gọn]
- 💡 **Mặt sau (Giải thích / Ý chính):** [Nêu định nghĩa, câu trả lời hoặc 2-3 ý cốt lõi]

... (Tạo đủ ${count} thẻ trọn vẹn, phong cách tự mãn súc tích xưng Ta - gọi Ngươi ở câu đầu)`;

    return await askAI(prompt);
}

/**
 * Hàm tìm bài đăng/tài liệu trong Server Discord và tự động chuyển đổi thành bộ Flashcards
 */
async function generateFlashcardsFromServer(query, guild, channelId = null) {
    if (!guild) {
        throw new Error('Cần thông tin Server (Guild) để tạo Flashcards!');
    }

    const serverData = await getServerContext(guild);

    const prompt = `Người dùng yêu cầu TẠO BỘ FLASHCARD HỌC TẬP từ các bài đăng, tài liệu hoặc cuộc trò chuyện trong Server Discord liên quan đến từ khóa/chủ đề: "${query}".

DỮ LIỆU NỘI BỘ SERVER DISCORD:
${serverData}

QUY TẮC TẠO FLASHCARD:
1. Tìm tất cả bài đăng, tài liệu, file đính kèm hoặc thảo luận liên quan đến từ khóa "${query}".
2. Xuất ra 3 đến 5 thẻ Flashcard chuẩn với định dạng:
   🎴 **Thẻ X:**
   - ❓ **Mặt trước (Thuật ngữ / Câu hỏi):** ...
   - 💡 **Mặt sau (Giải thích / Chi tiết):** ...
3. Trích dẫn rõ Tên bài đăng/Kênh và đính kèm đường Link URL trực tiếp dẫn tới nguồn bài đăng/tài liệu đó.
4. Giữ vững phong cách tự mãn tự tin của Bổn bot vô địch (xưng Ta, gọi Ngươi).`;

    return await askAIServer(prompt, guild, channelId);
}

/**
 * Hàm tạo Flashcard từ file đính kèm Discord hoặc file trên server
 */
async function generateFlashcardsFromFile(attachmentUrl, fileName, serverFileName) {
    let textContent = '';
    let targetTitle = '';

    if (attachmentUrl && fileName) {
        textContent = await fetchAndExtractText(attachmentUrl, fileName);
        targetTitle = fileName;
    } else if (serverFileName) {
        const targetPath = path.resolve(__dirname, '../', serverFileName);
        if (!fs.existsSync(targetPath) || !fs.statSync(targetPath).isFile()) {
            throw new Error(`Không tìm thấy file \`${serverFileName}\` trên máy chủ!`);
        }
        const buffer = fs.readFileSync(targetPath);
        textContent = await extractTextFromBuffer(serverFileName, buffer);
        targetTitle = serverFileName;
    } else {
        throw new Error('Cần đính kèm 1 file hoặc nhập tên file để tạo Flashcards!');
    }

    return await generateFlashcardsFromText(textContent, targetTitle, 5);
}

module.exports = {
    generateFlashcardsFromText,
    generateFlashcardsFromServer,
    generateFlashcardsFromFile
};
