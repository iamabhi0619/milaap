const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

const protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select("-password");
        if (!req.user) {
            return res.status(404).json({ success: false, message: "1User not found" });
        }
        next();
    } catch (error) {
        console.error("Error during token verification:", error);
        return res.status(401).json({ success: false, message: "Not authorized, token failed" });
    }
};

module.exports = { protect };
