"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const multer_1 = __importDefault(require("../middlewares/multer"));
//Controllers
const posts_controller_1 = require("../controllers/posts-controller");
//Middlewares
const Authentication_1 = require("../middlewares/Authentication");
router.route('/get-all-post').get([], posts_controller_1.get_all_post);
router.route('/get-all-post/:id').get([Authentication_1.AuthenticationMiddleware], posts_controller_1.get_all_post_by_user);
router.route('/get-summary-stats').get([Authentication_1.AuthenticationMiddleware], posts_controller_1.get_summary_stats);
router.route('/create-post').post([Authentication_1.AuthenticationMiddleware, multer_1.default.array('images', 6)], posts_controller_1.create_post);
router.route('/get-post/:id').get([], posts_controller_1.get_post_id);
router.route('/update-post/:id').put([Authentication_1.AuthenticationMiddleware, multer_1.default.array('images', 6)], posts_controller_1.update_post);
router.route('/delete-post/:id').delete([Authentication_1.AuthenticationMiddleware], posts_controller_1.delete_post);
exports.default = router;
