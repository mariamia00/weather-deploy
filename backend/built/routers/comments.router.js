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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var auth_mid_1 = __importDefault(require("../middlewares/auth.mid"));
var express_async_handler_1 = __importDefault(require("express-async-handler"));
var comments_model_1 = __importDefault(require("../models/comments.model"));
var post_model_1 = __importDefault(require("../models/post.model"));
var router = express_1.default.Router();
router.use(auth_mid_1.default);
router.post("/images/:postId/comments", (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var text, postId, userId, comment, post, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 5]);
                text = req.body.text;
                postId = req.params.postId;
                userId = req.user.id;
                comment = new comments_model_1.default({
                    text: text,
                    author: userId,
                    post: postId,
                });
                return [4 /*yield*/, comment.save()];
            case 1:
                _a.sent();
                return [4 /*yield*/, post_model_1.default.findById(postId)];
            case 2:
                post = _a.sent();
                if (!post) {
                    return [2 /*return*/, res.status(404).json({ error: "Post not found" })];
                }
                post.comments.push(comment._id);
                return [4 /*yield*/, post.save()];
            case 3:
                _a.sent();
                res.json(comment);
                return [3 /*break*/, 5];
            case 4:
                error_1 = _a.sent();
                res.status(500).json({ error: "Error creating comment" });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); }));
router.get("/images/:postId/comments", (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var postId, post, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                postId = req.params.postId;
                return [4 /*yield*/, post_model_1.default.findById(postId).populate({
                        path: "comments",
                        populate: {
                            path: "author",
                            model: "User",
                            select: "name", // Select the 'name' field from the User model
                        },
                    })];
            case 1:
                post = _a.sent();
                if (!post) {
                    return [2 /*return*/, res.status(404).json({ error: "Post not found" })];
                }
                // Return the comments for the post
                res.json(post.comments);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                res.status(500).json({ error: "Error fetching comments" });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); }));
// Delete a specific comment (only if the user is the author)
router.delete("/:commentId", (0, express_async_handler_1.default)(function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var commentId, userId, comment, post, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                commentId = req.params.commentId;
                userId = req.user.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                return [4 /*yield*/, comments_model_1.default.findById(commentId)];
            case 2:
                comment = _a.sent();
                if (!comment) {
                    return [2 /*return*/, res.status(404).json({ error: "Comment not found" })];
                }
                if (comment.author.toString() !== userId) {
                    return [2 /*return*/, res.status(403).json({ error: "Permission denied" })];
                }
                return [4 /*yield*/, post_model_1.default.findById(comment.post)];
            case 3:
                post = _a.sent();
                if (!post) {
                    return [2 /*return*/, res.status(404).json({ error: "Post not found" })];
                }
                // Find and remove the comment's ID from the post's comments array
                post.comments = post.comments.filter(function (commentRef) { return commentRef.toString() !== commentId; });
                // Save the updated post
                return [4 /*yield*/, post.save()];
            case 4:
                // Save the updated post
                _a.sent();
                // Delete the comment document
                return [4 /*yield*/, comments_model_1.default.deleteOne({ _id: commentId })];
            case 5:
                // Delete the comment document
                _a.sent();
                res.json({ message: "Comment deleted successfully" });
                return [3 /*break*/, 7];
            case 6:
                error_3 = _a.sent();
                res.status(500).json({ error: "Error deleting comment" });
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); }));
exports.default = router;
