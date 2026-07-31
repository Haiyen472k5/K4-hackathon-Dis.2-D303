
# 📌 Phần 1: Chuẩn Bị Môi Trường (Setup)

## Bước 1: Cài đặt Node.js

1. Tải và cài đặt **[Node.js](https://nodejs.org/)** (chọn phiên bản **LTS** để đảm bảo độ ổn định).
2. Kiểm tra cài đặt bằng cách mở Terminal (Command Prompt) và chạy:

```bash
node -v
npm -v
```

Nếu hiển thị số phiên bản của Node.js và npm thì bạn đã cài đặt thành công.

---

## Bước 2: Khởi tạo dự án

1. Tạo một thư mục mới, ví dụ:

```text
my-discord-bot
```

2. Mở Terminal tại thư mục đó và chạy:

```bash
npm init -y
```

Lệnh này sẽ tạo file `package.json` để quản lý dự án Node.js.

---

## Bước 3: Cài đặt Discord.js

Cài đặt phiên bản mới nhất của Discord.js:

```bash
npm install discord.js
```

---

# 📌 Phần 2: Cấu Hình Trên Discord Developer Portal

Để bot có thể đọc tin nhắn và nhận lệnh `/hi`, bạn cần cấu hình trong Discord Developer Portal.

## 1. Tạo ứng dụng

* Truy cập: https://discord.com/developers/applications
* Chọn **New Application**.
* Đặt tên cho bot.

---

## 2. Tạo Bot

Trong menu bên trái:

**Bot**

* Chọn **Reset Token** để lấy Bot Token.
* Sao chép Token và lưu ở nơi an toàn.
* Kéo xuống phần **Privileged Gateway Intents**.
* Bật:

  * ✅ **MESSAGE CONTENT INTENT**

> Nếu không bật quyền này, bot sẽ không đọc được nội dung tin nhắn để ghi log.

---

## 3. Mời Bot vào Server

Vào:

**OAuth2 → URL Generator**

### Scopes

Chọn:

* `bot`
* `applications.commands`

### Bot Permissions

Chọn:

* `Read Messages/View Channels`
* `Send Messages`

Sau đó:

* Copy URL được tạo ở cuối trang.
* Mở URL bằng trình duyệt.
* Chọn server Discord để thêm bot.

---

# 📌 Phần 3: Mã Nguồn Hoàn Chỉnh (`index.js`)

Tạo file:

```text
index.js
```

Sau đó dán toàn bộ đoạn code dưới đây.

Lưu ý: BOT_TOKEN và CLIENT_ID để mặc định nếu chỉ định dùng bot có sẵn. Hãy thay thế 2 tham số này nếu muốn test bot của bản thân.

```javascript
// Import các class cần thiết từ thư viện discord.js
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const fs = require('fs'); // Thư viện có sẵn của Node.js để quản lý file

// 1. CẤU HÌNH TOKEN VÀ ID CỦA BOT
const BOT_TOKEN = 'YOUR_DISCORD_BOT_TOKEN';
const CLIENT_ID = 'YOUR_CLIENT_ID'; // Lấy ở mục General Information trên Developer Portal

// 2. KHỞI TẠO BOT VỚI CÁC QUYỀN (INTENTS) CẦN THIẾT
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// 3. ĐỒNG BỘ LỆNH SLASH COMMAND (/hi)
const commands = [
    new SlashCommandBuilder()
        .setName('hi')
        .setDescription('Gửi lời chào thân thiện đến bạn!')
].map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(BOT_TOKEN);

client.once('ready', async () => {
    console.log(`🤖 Bot đã sẵn sàng! Đăng nhập dưới tên: ${client.user.tag}`);

    try {
        console.log('🔄 Đang đăng ký lệnh Slash Command (/)...');

        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands }
        );

        console.log('✅ Đã đồng bộ thành công lệnh /hi lên Discord!');
    } catch (error) {
        console.error('❌ Lỗi khi đồng bộ lệnh:', error);
    }
});

// 4. XỬ LÝ LỆNH /hi
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'hi') {
        const userName = interaction.user.displayName;

        await interaction.reply(
            `👋 Xin chào **${userName}**! Chúc bạn một ngày tốt lành!`
        );
    }
});

// 5. TỰ ĐỘNG LOG CHAT
client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    const timestamp = new Date().toLocaleString('vi-VN');
    const serverName = message.guild ? message.guild.name : 'Tin nhắn riêng (DM)';
    const channelName = message.channel.name || 'DM';
    const authorName = message.author.username;
    const content = message.content;

    const logOutput =
        `[${timestamp}] [S: ${serverName}] [#${channelName}] ${authorName}: ${content}\n`;

    console.log(logOutput.trim());

    fs.appendFile('chat_logs.txt', logOutput, 'utf8', (err) => {
        if (err) {
            console.error('❌ Lỗi khi ghi file log:', err);
        }
    });
});

// 6. KHỞI ĐỘNG BOT
client.login(BOT_TOKEN);
```

---

# 📌 Phần 4: Chạy Bot Và Kiểm Tra

## 1. Điền thông tin Bot

Mở file:

```text
index.js
```

Thay thế:

```javascript
const BOT_TOKEN = 'ĐIỀN_TOKEN_CỦA_BẠN_VÀO_ĐÂY';
const CLIENT_ID = 'ĐIỀN_APP_ID_CỦA_BOT_VÀO_ĐÂY';
```

bằng Token và Application ID thật của bạn.

---

## 2. Khởi động Bot

Trong Terminal:

```bash
node index.js
```

---

## 3. Kiểm tra

Nếu Terminal hiển thị:

```text
🤖 Bot đã sẵn sàng!
✅ Đã đồng bộ thành công lệnh /hi lên Discord!
```

thì bot đã hoạt động thành công.

---

## 4. Thử nghiệm

### Ghi log chat

* Gửi một vài tin nhắn trong server.
* Nội dung sẽ được:

  * In ra Terminal.
  * Ghi vào file `chat_logs.txt`.

### Lệnh Slash

Gõ:

```text
/hi
```

Bot sẽ trả lời:

> 👋 Xin chào **Tên của bạn**! Chúc bạn một ngày tốt lành!


---

# 🧭 Quy Trình 3 Bước Thêm Tính Năng Mới

Mọi tính năng trong **Discord.js v14** đều được phát triển theo quy trình gồm **3 bước** sau:

```text
[Bước 1: Khai báo lệnh]
            ↓
[Bước 2: Bắt sự kiện]
            ↓
[Bước 3: Xử lý logic & Phản hồi]
```

---

# 🔹 Bước 1: Khai Báo Lệnh (Register Command)

Bạn cần khai báo tên và mô tả của lệnh để Discord biết bot có thêm một **Slash Command** mới và hiển thị lệnh đó khi người dùng gõ `/`.

## 📍 Vị trí sửa code

Trong mảng:

```javascript
const commands = [
    ...
];
```

## 📝 Mẫu code

```javascript
new SlashCommandBuilder()
    .setName('ten_lenh_viet_lien_khong_dau')
    .setDescription('Mô tả ngắn gọn tính năng của lệnh');
```

---

# 🔹 Bước 2: Bắt Sự Kiện Người Dùng Gõ Lệnh (Listen Interaction)

Khi người dùng thực hiện một Slash Command, bot sẽ nhận được sự kiện `interactionCreate`.

Tại đây, bạn cần kiểm tra tên lệnh để xác định đoạn code nào sẽ được thực thi.

## 📍 Vị trí sửa code

Trong sự kiện:

```javascript
client.on('interactionCreate', async (interaction) => {
    ...
});
```

## 📝 Mẫu code

```javascript
if (interaction.commandName === 'ten_lenh_viet_lien_khong_dau') {
    // Code xử lý sẽ viết ở đây
}
```

---

# 🔹 Bước 3: Xử Lý Logic Và Phản Hồi (Execute & Reply)

Đây là nơi bạn:

* Thực hiện tính toán.
* Gọi API hoặc đọc dữ liệu.
* Xử lý yêu cầu của người dùng.
* Trả kết quả về Discord.

## 📝 Mẫu code

```javascript
// Hoãn phản hồi để tránh timeout sau 3 giây
await interaction.deferReply();

// Viết logic xử lý của bạn ở đây

await interaction.editReply('Nội dung kết quả gửi cho người dùng');
```

---

# 📚 Tóm Tắt

| Bước                          | Mục đích                                         |
| ------------------------------- | --------------------------------------------------- |
| **1. Register Command**   | Khai báo tên và mô tả của Slash Command.      |
| **2. Listen Interaction** | Kiểm tra người dùng đã gọi lệnh nào.       |
| **3. Execute & Reply**    | Thực hiện xử lý và gửi kết quả về Discord. |

> 💡 Hầu hết mọi tính năng mới trong Discord.js đều tuân theo quy trình 3 bước này. Chỉ cần lặp lại đúng cấu trúc trên, bạn có thể mở rộng bot với nhiều lệnh khác nhau như `/ping`, `/avatar`, `/userinfo`, `/weather`, `/translate`,...
