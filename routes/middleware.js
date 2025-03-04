const jwt = require("jsonwebtoken");
const { User } = require("..//db/user.js")
const { JWT_SECRET_KEY } = require("./secretKey.js");

const authMiddleware = async (req, res, next) => {

    const token = req.headers["authorization"];

    if (!token) {
        return res.status(411).json({
            msg: "Please provide token in headers"
        })
    }

    const retrieveToken = token.split(" ")[1];

    if (!retrieveToken) {
        return res.status(411).json({
            msg: "Token missing"
        })
    }

    try {
        const decoded = jwt.verify(retrieveToken, JWT_SECRET_KEY);
        const findUser = await User.findOne({
            _id: decoded.userId
        })

        console.log(decoded);

        if (!findUser) {
            return res.status(403).json({
                msg: "Invalid token"
            })
        }

        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error(error.message);
    }
}

module.exports = {
    authMiddleware
}
