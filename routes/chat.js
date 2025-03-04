const express = require('express');
const chatRouter = express.Router();
const axios = require('axios');
const { authMiddleware } = require('./middleware');
const { chatSession, chatMessage } = require('../db/user');
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

// 1. /chat/start (POST): Start a New Chat Session
chatRouter.post('/start', authMiddleware, async (req, res) => {
    try {
        const userId = req.userId; // Get user ID from decoded token
        const newChatSession = new chatSession({ user: userId });
        await newChatSession.save();
        res.status(201).json({ chatSessionId: newChatSession._id });
    } catch (error) {
        console.error("❌ Error starting chat session:", error.message);
        res.status(500).json({ error: "Error starting chat session", details: error.message });
    }
});

// 2. /chat/send (POST): Send a Message and Get Gemini's Response

chatRouter.post("/send", authMiddleware, async (req, res) => {
    const { prompt, chatSessionId } = req.body;

    if (!prompt || !chatSessionId) {
        return res.status(400).json({ error: "Missing prompt or chatSessionId" });
    }

    try {
        const userId = req.userId; // This should be the User _id, not Firebase UID
        const userObjectId = mongoose.Types.ObjectId.isValid(userId) ? userId : null;

        if (!userObjectId) {
            return res.status(400).json({ error: "Invalid userId" });
        }

        // 1. Store the user's message
        const newUserMessage = new chatMessage({
            chatSession: chatSessionId,
            sender: userObjectId, // Use the User _id
            timestamp: new Date(),
            isUserMessage: true, // Message sent by the user
        });

        // Set content based on whether it's a user message or Gemini response
        newUserMessage.content = prompt;

        await newUserMessage.save();

        // 2. Send prompt to Gemini API
        let geminiResponse;
        try {
            // Corrected Endpoint URL
            const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

            geminiResponse = await axios.post(
                geminiEndpoint,
                {
                    contents: [{ parts: [{ text: prompt }] }] // Corrected contents structure
                },
                {
                    headers: { "Content-Type": "application/json" }
                }
            );
        } catch (geminiError) {
            console.error("❌ Gemini API Error:", geminiError.response?.data || geminiError.message);

            // Store the error in the database
            const newGeminiMessage = new ChatMessage({
                chatSession: chatSessionId,
                sender: userObjectId, // Use the User _id
                timestamp: new Date(),
                isUserMessage: false, // Message sent by Gemini
            });

            newGeminiMessage.content = `Gemini API Error: ${geminiError.message}`;

            await newGeminiMessage.save();

            return res.status(500).json({ error: "Gemini API error", details: geminiError.response?.data || geminiError.message });
        }
        // 3. Extract AI Response
        const reply = geminiResponse.data.candidates[0]?.content.parts[0]?.text || "No response from Gemini.";

        // 4. Store Gemini's response
        const newGeminiMessage = new chatMessage({
            chatSession: chatSessionId,
            sender: userObjectId, // Use the User _id
            timestamp: new Date(),
            isUserMessage: false, // Message sent by Gemini
        });

        newGeminiMessage.content = reply;

        await newGeminiMessage.save();

        console.log("Gemini Response:", geminiResponse.data);
        res.json({ reply });

    } catch (error) {
        console.error("❌ Error processing message:", error.message);
        res.status(500).json({ error: "Failed to process request", details: error.message });
    }
});

// 3. /chat/history/:chatSessionId (GET): Get Chat History for a Session
// chatRouter.get('/history/:chatSessionId', verifyToken, async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const chatSessionId = req.params.chatSessionId;
//
//     // Validate chatSessionId
//     if (!mongoose.Types.ObjectId.isValid(chatSessionId)) {
//       return res.status(400).json({ error: "Invalid chatSessionId" });
//     }
//
//     const chatHistory = await ChatMessage.find({ chatSession: chatSessionId, user: userId })
//       .sort({ timestamp: 1 });
//
//     res.json(chatHistory);
//   } catch (error) {
//     console.error("❌ Error fetching chat history:", error.message);
//     res.status(500).json({ error: "Error fetching chat history", details: error.message });
//   }
// });
//
// // 4. /chat/sessions (GET): Get List of Chat Sessions
// chatRouter.get('/sessions', verifyToken, async (req, res) => {
//   try {
//     const userId = req.user.userId;
//     const chatSessions = await ChatSession.find({ user: userId })
//       .sort({ startTime: -1 });
//
//     res.json(chatSessions);
//   } catch (error) {
//     console.error("❌ Error fetching chat sessions:", error.message);
//     res.status(500).json({ error: "Error fetching chat sessions", details: error.message });
//   }
// });
//
// // 5. /chat/rename/:chatSessionId (PUT): Rename a Chat Session
// chatRouter.put('/rename/:chatSessionId', verifyToken, async (req, res) => {
//   const { title } = req.body;
//   const chatSessionId = req.params.chatSessionId;
//
//   if (!title) {
//     return res.status(400).json({ error: "Missing title" });
//   }
//
//   try {
//     const userId = req.user.userId;
//
//     // Validate chatSessionId
//     if (!mongoose.Types.ObjectId.isValid(chatSessionId)) {
//       return res.status(400).json({ error: "Invalid chatSessionId" });
//     }
//
//     const chatSession = await ChatSession.findOneAndUpdate(
//       { _id: chatSessionId, user: userId },
//       { title: title },
//       { new: true, runValidators: true } // Return the updated document and run validators
//     );
//
//     if (!chatSession) {
//       return res.status(404).json({ error: "Chat session not found" });
//     }
//
//     res.json(chatSession);
//   } catch (error) {
//     console.error("❌ Error renaming chat session:", error.message);
//     res.status(500).json({ error: "Error renaming chat session", details: error.message });
//   }
// });
//
module.exports = {
    chatRouter
};
