"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const user_router_1 = __importDefault(require("./routers/user.router"));
const database_config_1 = require("./database.config");
const post_router_1 = __importDefault(require("./routers/post.router"));
const path_1 = __importDefault(require("path"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("./models/user.model");
const contact_router_1 = __importDefault(require("./routers/contact.router"));
const comments_router_1 = __importDefault(require("./routers/comments.router"));
(0, database_config_1.dbConnect)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    origin: ["https://weatherwazee.onrender.com"],
}));
const UserModel = mongoose_1.default.model("User", user_model_1.UserSchema);
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use("/api/users", user_router_1.default);
app.use("/api", post_router_1.default);
app.use("/api", contact_router_1.default);
app.use("/api/comments", comments_router_1.default);
// Serve your Angular static files
app.use(express_1.default.static(path_1.default.join(__dirname, "../../../frontend/dist/weather/")));
// Catch-all route to serve Angular's index.html
app.get("*", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "../../../frontend/dist/weather/index.html"));
});
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log("website served on http://localhost:" + port);
});
