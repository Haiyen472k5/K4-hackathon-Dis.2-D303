const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth'); // Đọc file Word (.docx)
const pdfParse = require('pdf-parse'); // Đọc file PDF (.pdf)
const WordExtractor = require('word-extractor'); // Đọc file Word cũ (.doc)
const wordExtractor = new WordExtractor();

// 🛠️ Hàm trích xuất văn bản từ Buffer dựa theo định dạng file (.docx, .pdf, .doc, .txt, .md, ...)
async function extractTextFromBuffer(fileName, buffer) {
    const ext = path.extname(fileName).toLowerCase();

    // 1. File Word (.docx)
    if (ext === '.docx') {
        const result = await mammoth.extractRawText({ buffer: buffer });
        return result.value || '';
    }

    // 2. File PDF (.pdf)
    if (ext === '.pdf') {
        const data = await pdfParse(buffer);
        return data.text || '';
    }

    // 3. File Word cũ (.doc)
    if (ext === '.doc') {
        try {
            const extracted = await wordExtractor.extract(buffer);
            const text = extracted.getBody();
            if (text && text.trim()) return text.trim();
        } catch (e) {
            console.error('❌ Lỗi đọc file .doc bằng word-extractor:', e.message);
        }
        // Fallback: Trích xuất các chuỗi ký tự hiển thị từ file binary .doc
        const str = buffer.toString('binary');
        const matches = str.match(/[\x20-\x7E\s\u00A0-\u024F\u1EA0-\u1EF9]{4,}/g);
        if (matches && matches.length > 0) {
            return matches.join(' ').trim();
        }
        return 'Không thể trích xuất văn bản từ file .doc này.';
    }

    // 4. Phát hiện file nén nhị phân / ZIP nếu chứa header PK!
    const isZipHeader = buffer.length >= 4 && buffer[0] === 0x50 && buffer[1] === 0x4b;
    if (isZipHeader && ext !== '.docx') {
        throw new Error('File nén nhị phân (ZIP/Binary) không thể đọc trực tiếp thành văn bản!');
    }

    // 5. Mặc định đọc dạng UTF-8 cho các file text (.txt, .md, .js, .json, .csv, ...)
    return buffer.toString('utf8');
}

// 🛠️ Hàm tải file từ URL đính kèm Discord
async function fetchAndExtractText(attachmentUrl, fileName) {
    const { logApiCall, logApiResponse, logApiError } = require('./apiLogger');
    const startTime = Date.now();
    
    logApiCall('Discord Attachment Fetch', {
        endpoint: attachmentUrl,
        promptPreview: `Tải file tài liệu "${fileName}"`
    });

    try {
        const response = await fetch(attachmentUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        if (!response.ok) {
            throw new Error(`Tải file thất bại với mã lỗi HTTP ${response.status}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const duration = Date.now() - startTime;

        logApiResponse('Discord Attachment Fetch', duration, {
            status: response.status,
            outputPreview: `Đã tải thành công ${buffer.length} bytes cho file "${fileName}"`
        });

        // 💾 Tự động lưu trực tiếp file gốc nhị phân (.pdf, .docx, .doc...) vào history/documents/files/
        try {
            const { saveRawDocumentFile } = require('./historyManager');
            saveRawDocumentFile(fileName, buffer);
        } catch (e) {}

        return await extractTextFromBuffer(fileName, buffer);
    } catch (err) {
        const duration = Date.now() - startTime;
        logApiError('Discord Attachment Fetch', duration, err, {
            promptPreview: attachmentUrl
        });
        throw err;
    }
}

// 🛠️ Định dạng phản hồi tài liệu (Tự động kích hoạt Tool tóm tắt AI nếu tài liệu > 300 từ)
async function formatDocumentResponse(fileName, rawContent) {
    const trimmed = rawContent.trim();
    if (!trimmed) {
        return `📄 **Tài liệu:** \`${fileName}\`\n\n⚠️ *(Tài liệu trống hoặc không tìm thấy văn bản có thể đọc)*`;
    }

    const words = trimmed.split(/\s+/);
    const totalWords = words.length;

    // LUÔN TỰ ĐỘNG TẠO TÓM TẮT Ý CHÍNH BẰNG AI VÀ LƯU VÀO HISTORY
    const { saveDocumentHistory } = require('./historyManager');
    let summaryText = '';

    try {
        const { summarizeText } = require('./summarizeTool');
        summaryText = await summarizeText(trimmed, fileName);
    } catch (e) {
        console.error('❌ Lỗi tự động tóm tắt tài liệu:', e.message);
        summaryText = `Tóm tắt ý chính tự động cho tài liệu ${fileName}.`;
    }

    // Lưu trọn vẹn văn bản + tóm tắt AI vào history/documents/
    saveDocumentHistory(fileName, null, trimmed, summaryText);

    if (totalWords > 300) {
        return `📄 **Tài liệu:** \`${fileName}\` (Tổng cộng ${totalWords} chữ - *⚡ Đã tự động tạo Tóm tắt AI*)\n\n${summaryText}`;
    }

    // Nếu <= 300 chữ, hiển thị văn bản trực tiếp
    let responseHeader = `📄 **Tài liệu:** \`${fileName}\` (${totalWords} chữ)\n\n`;
    let responseContent = `\`\`\`text\n${trimmed}\n\`\`\``;

    let fullMessage = responseHeader + responseContent;

    if (fullMessage.length > 1950) {
        const maxCharLength = 1950 - responseHeader.length - 20;
        responseContent = `\`\`\`text\n${trimmed.substring(0, maxCharLength)}...\n\`\`\``;
        fullMessage = responseHeader + responseContent;
    }

    return fullMessage;
}

module.exports = {
    extractTextFromBuffer,
    fetchAndExtractText,
    formatDocumentResponse
};
