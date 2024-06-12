"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
//controller
const comments_controller_1 = require("../controllers/comments-controller");
//middlewares
const Authentication_1 = require("../middlewares/Authentication");
router.route('/get-comment-list/:postId').get([], comments_controller_1.get_comments_by_post);
router.route('/create-comment/:postId').post([Authentication_1.AuthenticationMiddleware], comments_controller_1.create_comments);
router.route('/update-comment/:postId/:commentId').put([Authentication_1.AuthenticationMiddleware], comments_controller_1.update_comments);
router.route('/delete-comment/:postId/:commentId').put([Authentication_1.AuthenticationMiddleware], comments_controller_1.delete_comments);
exports.default = router;
