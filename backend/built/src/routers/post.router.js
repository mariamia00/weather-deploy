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
const multer_1 = __importDefault(require("multer"));
const firebase_config_1 = require("../../firebase.config"); // Import your Firebase config
const post_model_1 = __importDefault(require("../models/post.model"));
const auth_mid_1 = __importDefault(require("../middlewares/auth.mid"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const uuid_1 = require("uuid");
const user_model_1 = require("../models/user.model");
const comments_model_1 = __importDefault(require("../models/comments.model"));
const router = express_1.default.Router();
router.use(auth_mid_1.default);
const storage = multer_1.default.memoryStorage(); // Use memory storage for in-memory file handling
const upload = (0, multer_1.default)({ storage });
router.post("/images", upload.single("image"), (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const { title } = req.body;
        const imageBuffer = req.file.buffer;
        const fileName = `postsImages/${(0, uuid_1.v4)()}_${req.file.originalname}`;
        const file = firebase_config_1.bucket.file(fileName);
        // Upload file to Firebase Storage
        yield file.save(imageBuffer, {
            contentType: req.file.mimetype,
            metadata: {
                firebaseStorageDownloadTokens: (0, uuid_1.v4)(), // Token for access
            },
        });
        // Generate URL for the uploaded file
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebase_config_1.bucket.name}/o/${encodeURIComponent(fileName)}?alt=media&token=${(0, uuid_1.v4)()}`;
        // Save image data to MongoDB
        const newImage = new post_model_1.default({
            title,
            imageUrl,
            author: req.user.id,
        });
        yield newImage.save();
        res.status(200).json({ message: "Image saved successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
})));
router.get("/images", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const images = yield post_model_1.default.find({}, "_id title imageUrl author comments createdAt").populate("comments");
        images.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        const imagesWithAuthors = yield Promise.all(images.map((image) => __awaiter(void 0, void 0, void 0, function* () {
            const author = yield user_model_1.UserModel.findById(image.author);
            if (author) {
                return {
                    _id: image._id,
                    title: image.title,
                    imageUrl: image.imageUrl,
                    authorName: author.name,
                    author: author._id,
                };
            }
            else {
                return null; // Handle the case where the author is not found
            }
        })));
        const validImagesWithAuthors = imagesWithAuthors.filter((image) => image !== null);
        // Return an empty array if there are no valid images
        res.json(validImagesWithAuthors);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
}));
router.delete("/images/:postId", (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const postId = req.params.postId;
        const userId = req.user.id;
        // Find the post in MongoDB
        const post = yield post_model_1.default.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (post.author.toString() !== userId) {
            return res.status(403).json({ message: "Permission denied" });
        }
        // Delete post record from MongoDB
        yield post_model_1.default.deleteOne({ _id: postId });
        yield comments_model_1.default.deleteMany({ post: postId });
        // Extract the file path from the URL
        const fullUrl = post.imageUrl;
        // Parse URL to get the path
        const url = new URL(fullUrl);
        const path = url.pathname; // This will get '/o/postsImages/your-image.jpg'
        const pathStart = path.indexOf("/o/") + 3; // Find the start of the path
        const encodedPath = path.substring(pathStart); // Extract the path after '/o/'
        // Decode the URL-encoded path
        const filePath = decodeURIComponent(encodedPath);
        // console.log(`Attempting to delete file: ${filePath}`);
        // Delete the image from Firebase Storage
        const file = firebase_config_1.bucket.file(filePath);
        yield file.delete();
        res.json({ message: "Post and image deleted successfully" });
    }
    catch (error) {
        console.error("Failed to delete image from Firebase Storage:", error);
        res.status(500).json({ error: "Internal server error" });
    }
})));
exports.default = router;
