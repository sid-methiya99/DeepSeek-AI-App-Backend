const { User, chatSession } = require('../db/user');
const express = require('express');
const { signUpUser, signInUser } = require('./types');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET_KEY } = require('./secretKey');

const userRouter = express.Router();
userRouter.post("/signup", async (req, res) => {
    const body = req.body;
    const validateInput = signUpUser.safeParse(body);

    if (!validateInput.success) {
        return res.status(403).json({
            msg: "Invalid inputs"
        })
    }

    const checkExistingUser = await User.findOne({
        email: body.email
    })

    if (checkExistingUser) {
        return res.status(411).json({
            msg: "Email already existed"
        })
    }

    console.log("Reached already before try")
    try {
        const newUser = new User({
            username: body.username,
            email: body.email,
            password: body.password, // The password will be hashed by the middleware
        });

        await newUser.save(); // Save the new user instance

        res.status(200).json({
            msg: "User created successfully",
        });
    } catch (error) {
        console.error("Error: " + error.message);
        res.status(500).json({ msg: "Failed to create user", error: error.message }); // Important: Send an error response
    }
});

userRouter.post("/signin", async (req, res) => {
    console.log("Hello from user")
    const body = req.body;
    const validateInput = signInUser.safeParse(body);
    if (!validateInput.success) {
        return res.status(403).json({
            msg: "Invalid inputs"
        })
    }
    try {
        const bodyemail = body.email;
        console.log(bodyemail);
        const user = await User.findOne({ email: bodyemail });
        console.log("Hello")
        if (!user) {
            return res.status(401).json({ msg: 'Invalid credentials' }); // User not found
        }
        const isMatch = await bcrypt.compare(body.password, user.password);
        if (!isMatch) {
            return res.status(401).json({ msg: 'Invalid credentials' }); // Password doesn't match
        }
        const userId = user._id;
        const email = user.email;
        const username = user.username;

        // Find the most recent chat session for this user
        const recentSession = await chatSession.findOne(
            { user: userId },
            {},
            { sort: { startTime: -1 } } // Sort by startTime in descending order
        );

        const token = jwt.sign({
            userId
        }, JWT_SECRET_KEY);

        // Include the most recent chat session ID in the response if one exists
        const responseData = {
            msg: 'Login successful',
            token,
            email,
            username
        };

        if (recentSession) {
            responseData.recentChatSessionId = recentSession._id;
        }

        res.status(200).json(responseData);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ msg: 'Login failed', error: error.message });
    }
});

module.exports = {
    userRouter
}
