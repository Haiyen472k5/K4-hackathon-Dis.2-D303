const fs = require('fs');
const path = require('path');

// Đường dẫn file lưu vết API Log
const LOG_FILE_PATH = path.resolve(__dirname, '../api_logs.txt');

/**
 * Lấy thời gian ISO định dạng chuẩn dễ đọc (Giờ Việt Nam)
 */
function formatTimestamp() {
    const now = new Date();
    return now.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
}

/**
 * Ghi log vào file api_logs.txt
 */
function writeToLogFile(logEntry) {
    try {
        fs.appendFileSync(LOG_FILE_PATH, logEntry + '\n', 'utf8');
    } catch (err) {
        console.error('❌ Lỗi khi ghi file api_logs.txt:', err.message);
    }
}

/**
 * Log thông tin YÊU CẦU API (API Request Start)
 */
function logApiCall(apiName, requestData = {}) {
    const timestamp = formatTimestamp();
    const logHeader = `==================================================\n[${timestamp}] 🌐 [API REQUEST] -> ${apiName}`;
    const details = [];
    
    if (requestData.model) details.push(`  • Model: ${requestData.model}`);
    if (requestData.endpoint) details.push(`  • Endpoint: ${requestData.endpoint}`);
    if (requestData.promptPreview) details.push(`  • Prompt/Input: "${requestData.promptPreview.replace(/\n/g, ' ')}"`);
    if (requestData.messageCount) details.push(`  • Messages count: ${requestData.messageCount}`);
    if (requestData.extra) details.push(`  • Metadata: ${JSON.stringify(requestData.extra)}`);

    const fullLog = `${logHeader}\n${details.join('\n')}`;
    console.log(fullLog);
    writeToLogFile(fullLog);
}

/**
 * Log thông tin KẾT QUẢ THÀNH CÔNG (API Response Success)
 */
function logApiResponse(apiName, durationMs, responseData = {}) {
    const timestamp = formatTimestamp();
    const logHeader = `[${timestamp}] ✅ [API SUCCESS] <- ${apiName} (${durationMs}ms)`;
    const details = [];
    
    if (responseData.status) details.push(`  • HTTP Status: ${responseData.status}`);
    if (responseData.tokens) details.push(`  • Tokens usage: ${JSON.stringify(responseData.tokens)}`);
    if (responseData.outputPreview) details.push(`  • Output preview: "${responseData.outputPreview.replace(/\n/g, ' ')}"`);

    const fullLog = `${logHeader}\n${details.join('\n')}\n==================================================`;
    console.log(fullLog);
    writeToLogFile(fullLog);
}

/**
 * Log THÔNG TIN LỖI CHI TIẾT KHI GỌI API THẤT BẠI (API Response Error)
 * Giúp phát hiện nguyên nhân sai ở đâu: Sai Key, Sai Model, Hết Quota, Rate Limit, Timeout, Payload lỗi...
 */
function logApiError(apiName, durationMs, error, context = {}) {
    const timestamp = formatTimestamp();
    const logHeader = `[${timestamp}] ❌ [API ERROR] <- ${apiName} (Thời gian xử lý: ${durationMs}ms)`;
    const details = [];
    
    details.push(`  • Error Name: ${error.name || 'Error'}`);
    details.push(`  • Error Message: ${error.message || String(error)}`);
    
    if (error.status) details.push(`  • HTTP Status Code: ${error.status}`);
    if (error.code) details.push(`  • Error Code: ${error.code}`);
    if (error.type) details.push(`  • Error Type: ${error.type}`);
    
    // Đọc thêm chi tiết lỗi trả về từ OpenRouter / OpenAI API Body (nếu có)
    if (error.error) {
        details.push(`  • API Response Error Body: ${JSON.stringify(error.error, null, 2)}`);
    }
    if (error.response?.data) {
        details.push(`  • Response Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    if (context.model) details.push(`  • Model được sử dụng: ${context.model}`);
    if (context.promptPreview) details.push(`  • Request Payload gây lỗi: "${context.promptPreview.replace(/\n/g, ' ')}"`);
    
    if (error.stack) {
        details.push(`  • Stack Trace:\n${error.stack.split('\n').map(line => '    ' + line).join('\n')}`);
    }

    const fullLog = `${logHeader}\n${details.join('\n')}\n==================================================`;
    console.error(fullLog);
    writeToLogFile(fullLog);
}

module.exports = {
    logApiCall,
    logApiResponse,
    logApiError,
    LOG_FILE_PATH
};
