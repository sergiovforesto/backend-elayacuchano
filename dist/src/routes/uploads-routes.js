"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const multer_1 = __importDefault(require("../middlewares/multer"));
//controller
const image_controller_1 = require("../controllers/image-controller");
//Middleware
const Authentication_1 = require("../middlewares/Authentication");
router.route('/upload-image').post([Authentication_1.AuthenticationMiddleware, multer_1.default.array('images', 3)], image_controller_1.upload_image_cloudinary);
router.route('/delete-image/:id').delete([Authentication_1.AuthenticationMiddleware,], image_controller_1.destroy_image_cloudinary);
exports.default = router;
