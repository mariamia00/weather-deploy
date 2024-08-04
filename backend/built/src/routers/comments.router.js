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
const auth_mid_1 = __importDefault(require("../middlewares/auth.mid"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const comments_model_1 = __importDefault(require("../models/comments.model"));
const post_model_1 = __importDefault(require("../models/post.model"));
const router = express_1.default.Router();
router.use(auth_mid_1.default);
router.post("/images/:postId/comments", (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { text } = req.body;
        const { postId } = req.params;
        const userId = req.user.id;
        const comment = new comments_model_1.default({
            text,
            author: userId,
            post: postId,
        });
        yield comment.save();
        const post = yield post_model_1.default.findById(postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        post.comments.push(comment._id);
        yield post.save();
        res.json(comment);
    }
    catch (error) {
        res.status(500).json({ error: "Error creating comment" });
    }
})));
router.get("/images/:postId/comments", (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Parse the request parameters
        const { postId } = req.params;
        const post = yield post_model_1.default.findById(postId).populate({
            path: "comments",
            populate: {
                path: "author",
                model: "User",
                select: "name", // Select the 'name' field from the User model
            },
        });
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        // Return the comments for the post
        res.json(post.comments);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching comments" });
    }
})));
// Delete a specific comment (only if the user is the author)
router.delete("/:commentId", (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const commentId = req.params.commentId;
    const userId = req.user.id;
    try {
        const comment = yield comments_model_1.default.findById(commentId);
        if (!comment) {
            return res.status(404).json({ error: "Comment not found" });
        }
        if (comment.author.toString() !== userId) {
            return res.status(403).json({ error: "Permission denied" });
        }
        // Remove the comment's reference from the post's comments array
        const post = yield post_model_1.default.findById(comment.post);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        // Find and remove the comment's ID from the post's comments array
        post.comments = post.comments.filter((commentRef) => commentRef.toString() !== commentId);
        // Save the updated post
        yield post.save();
        // Delete the comment document
        yield comments_model_1.default.deleteOne({ _id: commentId });
        res.json({ message: "Comment deleted successfully" });
    }
    catch (error) {
        res.status(500).json({ error: "Error deleting comment" });
    }
})));
exports.default = router;
