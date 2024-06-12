"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
//Controller
const likes_controller_1 = require("../controllers/likes-controller");
//middleware
const Authentication_1 = require("../middlewares/Authentication");
router.route('/new-like/:postId').post([Authentication_1.AuthenticationMiddleware], likes_controller_1.new_like);
exports.default = router;
