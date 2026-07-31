# 🤖 BỘ PROMPT TỔNG HỢP VÀ CẤU TRÚC HỆ THỐNG BOTVODICH DISCORD AI

> **Mô tả**: Tài liệu tóm tắt toàn bộ System Prompt, tính năng, kiến trúc kỹ thuật và luồng xử lý của Bot **Botvodich** trên Discord Server.

---

## 🎭 1. SYSTEM PROMPT & PERSONA BẮT BUỘC (BOTVODICH)

```markdown
Bạn là "Botvodich" - trợ lý AI vô địch, tự tin và siêu việt trong Server Discord này!

[PHONG CÁCH XƯNG HỒ & THÁI ĐỘ]
- Tự xưng là "Ta" và gọi người dùng là "Ngươi".
- Giọng văn tự tin, hiện đại, uyên bác nhưng vẫn thân thiện, lịch sự và giải đáp chính xác.
- Khi đang suy nghĩ / xử lý: Hiển thị thông báo trạng thái đúng từng chữ: "Ta đang vận, nhà ngươi đợi xíu ...".

[QUY TẮC PHẢN HỒI & LIÊN KẾT DISCORD]
1. TRÍCH DẪN LINK THUẦN DISCORD (RAW URL): Trong Discord, cú pháp [Tên](URL) trong tin nhắn thường KHÔNG THỂ CLICK ĐƯỢC. Bạn BẮT BUỘC phải trích dẫn link URL THUẦN trực tiếp dạng:
   https://discord.com/channels/GUILD_ID/THREAD_ID
   đứng riêng một dòng để người dùng click vào chuyển hướng ngay lập tức!
2. CHỈ GỬI TÊN BÀI VÀ LINK (KHÔNG TÓM TẮT DÀI DÒNG KHI TÌM BÀI): Khi người dùng yêu cầu tìm bài đăng, bài viết hoặc tài liệu, bạn CHỈ GỬI TÊN BÀI VÀ LINK URL DISCORD TRỰC TIẾP. Tuyệt đối KHÔNG tự động tóm tắt nội dung dài dòng trừ khi người dùng yêu cầu tóm tắt.
3. NGUỒN SỰ THẬT NỘI BỘ: CHỈ trả lời dựa trên dữ liệu bài đăng, tin nhắn kênh và tài liệu thu thập trực tiếp từ Discord Server. Không tự bịa thông tin bên ngoài.
```

---

## 🚀 2. TỔNG HỢP TẤT CẢ CÁC CHỨC NĂNG CỦA BOT

### 🎴 1. Bộ Thẻ Học Thông Minh Flashcard Tương Tác (Interactive Canvas Flashcards)
- **Cơ chế**: Nhận diện lệnh `/flashcard`, `@Botvodich tạo flashcard...` hoặc file tài liệu đính kèm.
- **Vẽ ảnh đồ họa HD (Canvas `850x480`)**:
  - Đăng ký phông chữ chuẩn Windows `Segoe UI` (0% lỗi phông chữ Tiếng Việt).
  - Cỡ chữ siêu to đậm **`40px`** nổi bật, tràn khung hình.
  - Phối màu Gradient Tím Indigo (Mặt trước) & Lục Emerald (Mặt sau).
- **Bộ nút bấm lật thẻ (Discord Buttons)**:
  - `🔄 Lật xem Đáp án` / `↩️ Lật lại Mặt trước`
  - `⬅️ Thẻ trước`, `➡️ Thẻ sau`, `🔀 Trộn ngẫu nhiên`.

### 📌 2. Đọc Bài Đăng & Kênh Trực Tiếp Trên Discord Server (Live Discord Reader)
- **Truy xuất trực tiếp Live Discord API**:
  - Đọc toàn bộ Bài đăng (Active & Archived Threads/Forum Posts) trong kênh `#chia-sẻ`.
  - Đọc tin nhắn gần nhất trong các kênh văn bản.
- **Đọc File Đính Kèm Thông Minh**:
  - Với các file tài liệu (`.pdf`, `.docx`, `.doc`), bot **chỉ đọc Tên File & Link Tải** (`[File đính kèm: "Tên_File.pdf" | Link: ... ]`), không đưa hàng chục trang nội dung vào prompt ➔ Giúp phản hồi cực nhanh & không tốn token.
- **Tự động gắn Link Click Trực Tiếp (Auto Link Injector)**:
  - Tự động quét và chèn đường link xanh `https://discord.com/channels/...` ở cuối câu trả lời nếu tìm thấy bài viết.

### 📚 3. Quản Lý Lịch Sử Độc Lập (`history/`)
- **Phân tách lưu trữ**:
  - `history/web_links/`: Chỉ lưu trữ liên kết Web & YouTube kèm tóm tắt vắn tắt.
  - Xóa sạch `history/chats/` và `history/documents/` để tránh trùng lặp dữ liệu với Server Discord Live.

### ⚡ 4. Tối Ưu Hóa Tốc Độ & Tiết Kiệm Token (Speed & Token Engineering)
- **Quét Kênh Song Song (`Promise.all`)**: Duyệt đồng thời tất cả kênh & bài đăng trong ~200ms.
- **Cache Server Context 3 Phút (`180000ms`)**: Giảm 100% độ trễ mạng cho các tin nhắn hỏi liên tiếp.
- **Phản Hồi Siêu Tốc Cho Trò Chuyện Thường (`⚡ <0.5s`)**: Bỏ qua bước quét server đối với các câu chào hỏi/tán gẫu thông thường (`"chào bro"`, `"hi"`, `"bạn là ai"`).

---

## 🛠️ 3. DANH SÁCH LỆNH (COMMAND REGISTRY)

| Loại Lệnh | Tên Lệnh | Mô Tả |
| :--- | :--- | :--- |
| **Slash Command** | `/flashcard` | Tạo bộ thẻ ghi nhớ tương tác từ file hoặc văn bản |
| **Slash Command** | `/ask_server` | Hỏi đáp dữ liệu nội bộ server Discord |
| **Slash Command** | `/search` | Tìm kiếm bài đăng & tài liệu theo từ khóa |
| **Slash Command** | `/summarize` | Tóm tắt bài viết / đường link web |
| **Slash Command** | `/read` | Đọc và trích xuất nội dung file/kênh |
| **Prefix Command** | `)(flashcards` | Tạo bộ Flashcard tương tác qua prefix `)(` |
| **Prefix Command** | `)(search` | Tìm kiếm bài đăng siêu tốc 0 token |
| **Prefix Command** | `)(tomtat` | Tóm tắt nội dung ngắn gọn |
| **Mention** | `@Botvodich` | Trò chuyện trực tiếp hoặc yêu cầu trợ lý AI |

---

## ⚙️ 4. CẤU TRÚC THƯ MỤC NGUỒN (PROJECT ARCHITECTURE)

```
Day05-K4-Dis-2/
├── index.js                     # File khởi chạy Bot Discord & đăng ký Handlers
├── tools/
│   ├── aiTool.js                # Xử lý OpenRouter AI, Live Server Context & Auto Link Injector
│   ├── flashcardTool.js         # Đồ họa Canvas HD, Segoe UI & Bộ nút bấm lật Flashcard
│   ├── historyManager.js        # Quản lý bộ lưu trữ Web & YouTube links
│   ├── documentTool.js         # Trích xuất file PDF / Word
│   ├── searchTool.js           # Thuật toán tìm kiếm từ khóa bài đăng
│   └── apiLogger.js            # Ghi log gọi API OpenRouter
├── history/
│   └── web_links/               # Lưu trữ tóm tắt Web/YouTube
└── BOT_PROMPT_SUMMARY.md        # File tổng hợp Prompt & Chức năng hệ thống
```
