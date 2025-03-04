// import { chatRouter } from './chat.js';
const { chatRouter } = require("./chat.js");
const { userRouter } = require("./user.js")
const express = require("express")
const router = express.Router();

console.log("Hello from index.js")
router.use("/user", userRouter);
router.use("/chat", chatRouter);

module.exports = {
    router
}

