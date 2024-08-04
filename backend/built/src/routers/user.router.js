"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_1 = require("express");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const user_model_1 = require("../models/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = (0, express_1.Router)();
//----------- LOGIN API---------------------
router.post("/login", (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield user_model_1.UserModel.findOne({ email });
    if (user && (yield bcryptjs_1.default.compare(password, user.password))) {
        res.send(generateTokenReponse(user));
    }
    else {
        res.status(400).send("Username or password is invalid!");
    }
})));
//-------------register API -----------
router.post("/register", (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    const user = yield user_model_1.UserModel.findOne({ email });
    if (user) {
        res.status(401).send("User already exists, please login!");
        return;
    }
    const encryptedPassword = yield bcryptjs_1.default.hash(password, 10);
    const newUser = {
        name,
        email: email.toLowerCase(),
        password: encryptedPassword,
    };
    const dbUser = yield user_model_1.UserModel.create(newUser);
    res.send(generateTokenReponse(dbUser));
})));
const generateTokenReponse = (user) => {
    if (!process.env.JWT_SECRET) {
        console.log("new error");
        throw new Error("secret token is not defined in the environment variables.");
    }
    const token = jsonwebtoken_1.default.sign({
        id: user._id,
    }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
    return {
        id: user._id,
        email: user.email,
        name: user.name,
        token: token,
    };
};
exports.default = router;
