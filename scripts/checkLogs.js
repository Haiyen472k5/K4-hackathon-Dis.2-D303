const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../chat_logs.txt');

function checkLogs() {
    if (!fs.existsSync(logFilePath)) {
        console.log('⚠️ Chưa tìm thấy file nhật ký chat_logs.txt.');
        return;
    }

    try {
        const content = fs.readFileSync(logFilePath, 'utf8');
        const lines = content.split('\n').filter(line => line.trim());
        console.log('📊 **Thống kê Nhật ký Chat (chat_logs.txt):**');
        console.log(`- Tổng số tin nhắn đã ghi nhận: ${lines.length} dòng.`);
        console.log('- 5 tin nhắn mới nhất:');
        lines.slice(-5).forEach(line => console.log(`  ${line}`));
    } catch (error) {
        console.error('❌ Lỗi khi đọc file log:', error.message);
    }
}

checkLogs();
