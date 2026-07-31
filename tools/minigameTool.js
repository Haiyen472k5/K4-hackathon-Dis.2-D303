const { askAI } = require('./aiTool');

// 1. GAME ĐOÁN SỐ (Number Guessing)
const numberGames = new Map();

/**
 * Khởi tạo game đoán số cho người chơi
 */
function startNumberGame(userId) {
    const target = Math.floor(Math.random() * 100) + 1; // Số từ 1 đến 100
    numberGames.set(userId, {
        target: target,
        attempts: 0,
        startTime: Date.now()
    });
    return `🎯 **Minigame Đoán Số (1 - 100)** đã bắt đầu!\nTa đã chọn một con số bí mật từ **1 đến 100**. Ngươi hãy đoán xem đó là số mấy bằng lệnh \`)(doaso [con_số]\` (Ví dụ: \`)(doaso 50\`)!`;
}

/**
 * Xử lý lượt đoán số
 */
function guessNumber(userId, guessInput) {
    if (!guessInput || guessInput.trim().toLowerCase() === 'start') {
        return startNumberGame(userId);
    }

    if (!numberGames.has(userId)) {
        // Tự động khởi tạo luôn nếu chưa có game
        startNumberGame(userId);
    }

    const game = numberGames.get(userId);
    const num = parseInt(guessInput.trim());

    if (isNaN(num) || num < 1 || num > 100) {
        return `⚠️ Vui lòng đoán một con số nguyên hợp lệ từ **1 đến 100**! VD: \`)(doaso 45\``;
    }

    game.attempts++;

    if (num === game.target) {
        const attempts = game.attempts;
        numberGames.delete(userId);
        return `🎉 **CHÚC MỪNG NGƯƠI!** Con số bí mật chính xác là **${num}**!\nNgươi đã đoán đúng sau **${attempts}** lần thử! 😎💥\n*(Hừm, coi như ngươi cũng có chút thông minh đấy!)*`;
    } else if (num < game.target) {
        return `📈 Số bí mật **LỚN HƠN** **${num}**! (Lần đoán thứ ${game.attempts})`;
    } else {
        return `📉 Số bí mật **NHỎ HƠN** **${num}**! (Lần đoán thứ ${game.attempts})`;
    }
}

// 2. GAME BÚA - BAO - KÉO (Rock-Paper-Scissors)
/**
 * Chơi Búa - Bao - Kéo solo với Botvodich
 */
function playRPS(userChoice) {
    const choices = ['bua', 'bao', 'keo'];
    const choiceNames = { bua: '✊ Búa', bao: '✋ Bao', keo: '✌️ Kéo' };

    const formattedChoice = (userChoice || '').toLowerCase().trim();
    if (!choices.includes(formattedChoice)) {
        return `⚠️ Lựa chọn không hợp lệ! Hãy chọn \`bua\` (Búa), \`bao\` (Bao) hoặc \`keo\` (Kéo). VD: \`)(rps bua\` hoặc \`)(keo\``;
    }

    const botChoice = choices[Math.floor(Math.random() * choices.length)];

    let result = '';
    let taunt = '';

    if (formattedChoice === botChoice) {
        result = `🤝 **HÒA RỒI!**`;
        taunt = `Cả Ta và Ngươi đều ra ${choiceNames[botChoice]}! Coi như hòa, lần sau Ta sẽ thắng! 😉`;
    } else if (
        (formattedChoice === 'bua' && botChoice === 'keo') ||
        (formattedChoice === 'bao' && botChoice === 'bua') ||
        (formattedChoice === 'keo' && botChoice === 'bao')
    ) {
        result = `🎉 **NGƯƠI ĐÃ THẮNG LẦN NÀY!**`;
        taunt = `Hừm! Ngươi ra ${choiceNames[formattedChoice]} còn Ta ra ${choiceNames[botChoice]}... Nhớ đấy, lần sau Bổn bot vô địch sẽ đập bẹp ngươi! 😤💥`;
    } else {
        result = `🔥 **BỔN BOT VÔ ĐỊCH ĐÃ THẮNG!**`;
        taunt = `Hahaha! Ngươi ra ${choiceNames[formattedChoice]} làm sao đấu lại ${choiceNames[botChoice]} của Ta! Thấy trình độ của Bổn bot chưa! 😎✨`;
    }

    return `🎮 **BÚA - BAO - KÉO SOLO VỚI BOTVODICH**\n\n👉 Ngươi chọn: **${choiceNames[formattedChoice]}**\n🤖 Ta chọn: **${choiceNames[botChoice]}**\n\n${result}\n💬 *${taunt}*`;
}

// 3. GAME ĐỐ VUI AI (AI Trivia)
/**
 * Tạo câu hỏi đố vui bằng OpenRouter AI
 */
async function getAITriviaQuestion(topic = 'tổng hợp') {
    const prompt = `Hãy tạo 1 câu hỏi đố vui ngắn gọn, thú vị và độc đáo thuộc chủ đề "${topic}".
Xuất ra định dạng markdown chuẩn như sau:
❓ **CÂU HỎI ĐỐ VUI (${topic.toUpperCase()}):** [Nội dung câu hỏi]

A. [Đáp án A]
B. [Đáp án B]
C. [Đáp án C]
D. [Đáp án D]

💡 **GỢI Ý:** [Một gợi ý nhỏ]
✅ **ĐÁP ÁN ĐÚNG:** [Ghi rõ chữ cái A/B/C/D và giải thích 1 câu ngắn gọn bằng phong cách "Bổn bot vô địch" tự mãn xưng Ta - gọi Ngươi]`;

    return await askAI(prompt);
}

// 4. BÓI TOÁN VẬN THẾ HÔM NAY (AI Daily Fortune)
/**
 * Xem vận thế hôm nay bằng OpenRouter AI
 */
async function getDailyFortune(username) {
    const prompt = `Hãy bói vận thế hôm nay cho người dùng tên "${username}".
Xuất ra bài phán vui tươi, hài hước bằng phong cách "Bổn bot vô địch" tự mãn xưng Ta - gọi Ngươi.
Gồm các mục:
🔮 **VẬN THẾ HÔM NAY CỦA ${username.toUpperCase()}:**
- 🌟 **Chỉ số may mắn:** [Số % ngẫu nhiên từ 60% đến 99%]
- 💼 **Học tập / Công việc:** [1 câu phán hài hước]
- 💖 **Tình cảm / Mối quan hệ:** [1 câu phán hài hước]
- 💡 **Lời khuyên từ Bổn bot vô địch:** [1 câu phán tự mãn]`;

    return await askAI(prompt);
}

// 5. DANH SÁCH MENU MINIGAME
function getMinigameMenu() {
    return `🎮 **DANH SÁCH MINIGAMES TRÊN DISCORD BOTVODICH** 🎮

1. 🎯 **Đoán Số Bí Mật (1 - 100):**
   - Lệnh Slash: \`/doaso\`
   - Lệnh Prefix: \`)(doaso [số_đoán]\` (VD: \`)(doaso 50\`)

2. ✊✋✌️ **Búa - Bao - Kéo Solo với Botvodich:**
   - Lệnh Slash: \`/rps\`
   - Lệnh Prefix: \`)(rps [bua|bao|keo]\` hoặc gõ nhanh \`)(bua\`, \`)(bao\`, \`)(keo\`

3. ❓ **Đố Vui AI Kì Thú (Trivia Challenge):**
   - Lệnh Slash: \`/doavui\` (có chọn chủ đề)
   - Lệnh Prefix: \`)(doavui [chủ_đề]\` (VD: \`)(doavui công nghệ\`, \`)(doavui mẹo\`)

4. 🔮 **Bói Vận Thế AI Hôm Nay:**
   - Lệnh Slash: \`/boitoan\`
   - Lệnh Prefix: \`)(boitoan\` hoặc \`)(boi\`

Thử sức ngay để xem ngươi có thắng được Bổn bot vô địch không nhé! 😎🔥`;
}

module.exports = {
    startNumberGame,
    guessNumber,
    playRPS,
    getAITriviaQuestion,
    getDailyFortune,
    getMinigameMenu
};
