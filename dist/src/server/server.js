"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const routePath_1 = require("../paths/routePath");
//Routes
const users_route_1 = __importDefault(require("../routes/users-route"));
const post_route_1 = __importDefault(require("../routes/post-route"));
const profile_route_1 = __importDefault(require("../routes/profile-route"));
const comments_route_1 = __importDefault(require("../routes/comments-route"));
const likes_route_1 = __importDefault(require("../routes/likes-route"));
const uploads_routes_1 = __importDefault(require("../routes/uploads-routes"));
class Server {
    app;
    port;
    path;
    constructor() {
        this.app = (0, express_1.default)();
        this.port = process.env.PORT || 5000;
        this.path = routePath_1.RoutePath;
        //Siempre deben ejecutarse antes que las rutas
        this.middlewares();
        this.routes();
    }
    middlewares() {
        this.app.use(express_1.default.json()); //Siempre se debe ejecutar de primero
        this.app.use((0, cors_1.default)({ origin: process.env.FRONTEND_URL }));
        this.app.use((0, helmet_1.default)());
    }
    routes() {
        this.app.use(this.path.users, users_route_1.default);
        this.app.use(this.path.posts, post_route_1.default);
        this.app.use(this.path.profile, profile_route_1.default);
        this.app.use(this.path.comments, comments_route_1.default);
        this.app.use(this.path.likes, likes_route_1.default);
        this.app.use(this.path.image, uploads_routes_1.default);
    }
    start() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
}
exports.default = Server;
