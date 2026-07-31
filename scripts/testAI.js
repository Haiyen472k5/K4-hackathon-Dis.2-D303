require('dotenv').config({ quiet: true });
const { askAI, OPENROUTER_MODEL } = require('../tools/aiTool');

async function testConnection() {
    console.log(`🤖 Đang kiểm tra kết nối tới OpenRouter AI (Mô hình: ${OPENROUTER_MODEL})...`);
    try {
        const response = await askAI('Xin chào! Hãy tự giới thiệu ngắn gọn trong 1 câu.');
        console.log('✅ Kết nối OpenRouter AI THÀNH CÔNG!');
        console.log('💬 Phản hồi:', response);
    } catch (error) {
        console.error('❌ Lỗi kiểm tra OpenRouter AI:', error.message);
    }
}

testConnection();
