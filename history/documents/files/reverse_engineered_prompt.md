# Reverse-Engineered Prompt for Day 05 Discord Bot

Dưới đây là prompt lập trình chi tiết để tái tạo lại toàn bộ codebase của bot Discord trợ lý học tập tên "Quân". Prompt này được thiết kế để cung cấp cho bất kỳ mô hình AI nào (chẳng hạn như Claude hay Gemini) để tự động sinh ra mã nguồn tương đương với cấu trúc dự án hiện tại của bạn.

---

## SYSTEM & DEVELOPER PROMPT TO GENERATE THE CODEBASE

```markdown
You are an expert backend Node.js developer. Your task is to generate a fully functioning Discord Bot codebase that acts as a student assistant named "Quân" for an AI practical course. The bot integrates with the Gemini API (using the official `@google/genai` SDK) to understand context, manage chat history, and execute tools (function calling) to search for files and forum posts directly within the Discord server.

Generate the codebase consisting of the following files:
1. `package.json`
2. `.env` (with placeholder keys)
3. `system_prompt.txt`
4. `test_sdk.js`
5. `index.js` (the main entry point)

Follow the detailed requirements below for each file.

---

### 1. File: `package.json`
Configure a Node.js project with CommonJS (`"type": "commonjs"`) and the following dependencies:
- `@google/genai`: `^2.15.0` (Must use the official new Google Gen AI SDK)
- `discord.js`: `^14.27.0`
- `dotenv`: `^17.4.2`

---

### 2. File: `.env`
Provide template environment variables:
```env
DISCORD_BOT_TOKEN=YOUR_DISCORD_BOT_TOKEN
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

---

### 3. File: `system_prompt.txt`
Write the system instruction for the AI model in Vietnamese:
- **Identity**: Friendly, enthusiastic, and intelligent assistant named "Quân". If asked about identity/model/owner, say they are "Quân", and do not mention external companies or models.
- **Tooling Rules**:
  - Only search using provided tools (`searchForumPosts` and `searchDiscordFiles`) when asked for information. Do not browse the web.
  - If information cannot be found via tools, state that the assistant is only designed to search within this Discord server.
  - Strictly distinguish: call `searchDiscordFiles` for uploaded documents/files (e.g. pdf, zip, png, docx, xlsx, code, slides) and `searchForumPosts` for discussions, threads, and forum posts.
  - Extract precise queries for search and `channelName` (without '#' symbol) if mentioned.
- **Answering Rules**:
  - Responses must include direct markdown links to files/posts (e.g., `[Xem bài viết](url)` or `[Tải file](url)`).
  - Short and concise responses (2-3 sentences unless detailed answer is requested).
  - Friendly Vietnamese language (using pronouns like cậu - tớ, hoặc bạn - mình) with appropriate emojis.
  - Polite, happy, and helpful attitude. Never reply with toxic or offensive content.

---

### 4. File: `test_sdk.js`
Create a simple utility script to verify the `@google/genai` SDK implementation:
- Load environment variables using `require('dotenv').config()`.
- Import `GoogleGenAI` from `@google/genai` and initialize it with `process.env.GEMINI_API_KEY`.
- Create a chat session using `ai.chats.create` with model `'gemini-3.5-flash-lite'`.
- Send test messages: "Hello, my name is Minh." and "I am learning programming."
- Demonstrate chat history trimming by manually slicing `chat.history` (e.g., keeping only the last 2 messages).
- Send a follow-up query "What is my name?" and log the final response text.

---

### 5. File: `index.js`
This is the core application script. Implement the following structures and logic:

#### A. Imports & Initialization:
- Load environment variables from `.env`.
- Import `{ Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder, AttachmentBuilder }` from `discord.js`.
- Import `fs` and `{ GoogleGenAI }` from `@google/genai`.
- Initialize `GoogleGenAI` client using `process.env.GEMINI_API_KEY`.
- Read system instructions dynamically from `system_prompt.txt` (fallback to `"Bạn là trợ lý Discord."` if file doesn't exist).
- Define `activeChats` using a `Map` keyed by Discord Channel ID.
- Define `MAX_HISTORY_LIMIT = 20`.

#### B. Search Matching Helper (`matchQuery(targetText, query)`):
- Return false if targetText or query is missing.
- Check if query matches a regex format `^\/(.+)\/([gimsuy]*)$`. If so, compile it and test against `targetText`.
- If not regex, clean both targetText and query by lowercasing and normalizing to remove Vietnamese accents/diacritics (using `.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd')`).
- Split query into separate words (split by whitespace) and verify if *every* word is contained within the normalized targetText (order-independent search).

#### C. Forum Post Search Tool (`searchForumPosts(guild, query, channelName)`):
- Iterate over the guild's channels.
- If `channelName` is specified, filter by lowercase name match (strip `#`).
- Check if the channel supports threads (`typeof channel.threads?.fetchActive === 'function'`).
- Fetch active threads using `channel.threads.fetchActive()`.
- For each active thread:
  - Match query against thread name or the thread's first/start message content (fetched via `thread.messages.fetch(thread.id)`).
  - Get thread creator's username using `guild.members.fetch(thread.ownerId)`.
  - Collect up to 5 matched results, each returning object format: `{ title, author, content (first 500 chars), channel: channel.name, url, createdAt (formatted to 'vi-VN' locale) }`.

#### D. Discord Files Search Tool (`searchDiscordFiles(guild, query, channelName)`):
- Iterate over guild's text-based channels (limit search to max 10 channels to prevent rate limits).
- Filter channels by `channelName` if specified.
- Fetch the last 50 messages: `channel.messages.fetch({ limit: 50 })`.
- Filter messages containing attachments (`message.attachments.size > 0`).
- Match query against the attachment's name.
- Collect up to 5 matched results, each returning object format: `{ fileName, fileUrl, fileSize, contentType, channel, author: message.author.username, messageUrl, createdAt }`.

#### E. Gemini Function Declarations (`searchDiscordTool`):
- Declare schemas for `searchForumPosts` and `searchDiscordFiles` with parameters:
  - `query` (required, string): Query string to search.
  - `channelName` (optional, string): Name of a specific channel to limit search scope.

#### F. Discord Client & Slash Command Sync:
- Initialize the Discord client with intents: `Guilds`, `GuildMessages`, `MessageContent`.
- Define a slash command `/hi` that returns: `"👋 Xin chào **${displayName}**! Chúc bạn một ngày tốt lành!"`.
- Set client ID from environment variable or placeholder (`CLIENT_ID` = `YOUR_DISCORD_CLIENT_ID`).
- Register the slash command on startup (`Routes.applicationCommands(CLIENT_ID)` via `REST` API).
- Handle `interactionCreate` event to process the `/hi` slash command.

#### G. Message Handling (`messageCreate` Event):
- Ignore messages from bots.
- Log every message to console and append to `chat_logs.txt` in format: `[timestamp] [S: serverName] [#channelName] authorName: content`.
- Check if the message tags/mentions the bot. If the bot is tagged:
  - Remove bot tag to extract the clean message content.
  - If content is empty, reply with a default friendly message: `<@authorId> Ơi! Mình nghe đây, bạn cần mình giúp gì nào? 🤖`.
  - Trigger "typing..." status in the channel: `message.channel.sendTyping()`.
  - Retrieve or create a Gemini chat session for the current channel using model `'gemini-3.5-flash-lite'`, dynamically read system instructions, and the declared tools.
  - **Gemini Chat Execution and Reset Logic**:
    - Wrap `chat.sendMessage({ message: cleanContent })` in try-catch.
    - If the API returns a 400 Bad Request (caused by broken history or thoughts cache), recreate/reset the chat session and retry sending the query.
  - **Function Calling Handler**:
    - Check if Gemini returned `functionCalls`. If yes, reject search queries if in DMs (reply with `"Hic, tính năng tra cứu chỉ hoạt động trong các Server Discord thôi bạn nhé!"`).
    - Execute the correct tool (`searchForumPosts` or `searchDiscordFiles`) in the current Guild.
    - Submit the result back to Gemini by calling `chat.sendMessage` with the `functionResponse` block:
      ```javascript
      {
        functionResponse: {
          name: call.name,
          response: { results: searchResults },
          id: call.id
        }
      }
      ```
  - **History Trimming**:
    - If `chat.history.length > 20`, trim the history array to keep only the last 20 messages, making sure the first message in the trimmed array is from the `'user'` role.
  - **Message Reply & File Attachment Logic**:
    - Discord direct upload limit is 25MB (`25 * 1024 * 1024` bytes).
    - If files are returned from `searchDiscordFiles`, try to attach them directly using `new AttachmentBuilder(file.fileUrl, { name: file.fileName })`. Accumulate their file sizes.
    - If adding a file exceeds 25MB total, do not attach it; instead, append it to a `linkedFiles` list.
    - Prepare the response text: `<@authorId> ${geminiText}`.
    - If there are `linkedFiles`, append download links as markdown text.
    - Reply to the message with the content and the physical files array (if any).
    - Wrap the reply in a try-catch. If direct uploading fails (e.g. timeout, network issue), fallback to replying with the text and *all* file links as text-only download links.
```

Hãy đảm bảo sinh mã nguồn sạch, đầy đủ comment tiếng Việt giải thích chức năng, và tuân thủ định dạng CommonJS module.
```
