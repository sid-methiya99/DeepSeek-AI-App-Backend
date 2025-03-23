
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

mongoose.connect(
    "mongodb+srv://siddharth:siddu789@cluster0.mugrk.mongodb.net/deepseekBackend",
);
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
})

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const chatMessageSchema = new mongoose.Schema({
    chatSession: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ChatSession', // Reference to the ChatSession model
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    isUserMessage: {
        type: Boolean,
        default: true, // Indicates if the message was sent by the user or the bot
    },
    content: {
        type: String,
        required: true,
    },
});

const chatSessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    name: {
        type: String,
        default: 'New Chat', // Default name for a new chat session
    },
    startTime: {
        type: Date,
        default: Date.now,
    },
    endTime: {
        type: Date,
        default: null, // Can be updated when the chat session ends
    },
    summary: {
        type: String,
        default: null, // Can be updated with a summary of the chat session
    }
});

const chatSession = mongoose.model('chatSession', chatSessionSchema);
const User = mongoose.model('User', userSchema);
const chatMessage = mongoose.model('chatMessage', chatMessageSchema);
module.exports = {
    User,
    chatMessage,
    chatSession
}

