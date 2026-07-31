const { askAI } = require('./aiTool');
const { fetchAndExtractText, extractTextFromBuffer } = require('./documentTool');
const fs = require('fs');
const path = require('path');

// 🛠️ Hàm tóm tắt văn bản bằng OpenRouter AI với phong cách Botvodich
async function summarizeText(rawText, title = 'Văn bản') {
    if (!rawText || !rawText.trim()) {
        throw new Error('Nội dung văn bản trống, không thể tóm tắt!');
    }

    const trimmedText = rawText.trim().substring(0, 8000); // Lấy tối đa 8000 ký tự đầu tiên để tóm tắt

    const prompt = `Hãy tóm tắt nội dung tài liệu/văn bản sau đây thành 3 - 5 ý chính quan trọng nhất.

TÊU ĐỀ: "${title}"
NỘI DUNG VĂN BẢN:
"""
${trimmedText}
"""

YÊU CẦU:
1. Giữ vững phong cách xưng "Bổn bot vô địch" tự mãn nhưng tóm tắt CỰC KỲ CHÍNH XÁC, TỈ MỈ, RÕ RÀNG.
2. Dùng các đầu dòng (bullet points) ngắn gọn, súc tích.`;

    return await askAI(prompt);
}

// 🛠️ Hàm tóm tắt từ file đính kèm hoặc file trên server
async function summarizeDocument(attachmentUrl, fileName, serverFileName) {
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
        throw new Error('Cần đính kèm file hoặc nhập tên file để tóm tắt!');
    }

    return await summarizeText(textContent, targetTitle);
}

module.exports = {
    summarizeText,
    summarizeDocument
};
