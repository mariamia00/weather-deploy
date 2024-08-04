"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
exports.default = (req, res, next) => {
    if (req.path === "/contact") {
        console.log("Skipping auth for /api/contact");
        return next();
    }
    const token = req.headers.access_token;
    if (!token) {
        console.log("No token found in headers.");
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decodedUser = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
        if (decodedUser) {
            // Attach the decoded user to the request for later use
            req.user = decodedUser;
            next();
        }
        else {
            console.log("Decoded user is undefined.");
            return res.status(401).json({ message: "Unauthorized" });
        }
    }
    catch (error) {
        console.log("Authentication error:", error);
        return res.status(401).json({ message: "Unauthorized" });
    }
};
