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
const express_1 = __importDefault(require("express"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const contact_model_1 = __importDefault(require("../models/contact.model"));
const router = express_1.default.Router();
router.post("/contact", (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, message } = req.body;
        // Form validation
        if (!name || !email || !message) {
            return res.status(400).send("All fields are required");
        }
        // Create a new contact object
        const newContact = new contact_model_1.default({
            name,
            email,
            message,
        });
        // Save the contact to the database
        yield newContact.save();
        // If everything is successful, send a response
        res.status(200).json({ message: "Form created and sent successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while processing your request.");
    }
})));
exports.default = router;
