require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function run() {
    try {
        const chat = ai.chats.create({
            model: 'gemini-3.5-flash-lite',
            config: {
                systemInstruction: "You are a friendly assistant.",
            }
        });

        await chat.sendMessage({ message: "Hello, my name is Minh." });
        await chat.sendMessage({ message: "I am learning programming." });

        console.log("History before trimming:", chat.history.length);

        // Cắt bớt history thủ công
        chat.history = chat.history.slice(-2);

        console.log("History after trimming:", chat.history.length);

        const response = await chat.sendMessage({ message: "What is my name?" });
        console.log("Reply:", response.text);
    } catch (e) {
        console.error("error:", e);
    }
}
run();
