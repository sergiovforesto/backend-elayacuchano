"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const multer_1 = __importDefault(require("../middlewares/multer"));
//controller
const profile_controller_1 = require("../controllers/profile-controller");
//middleware
const Authentication_1 = require("../middlewares/Authentication");
router.route('/create-profile').post([Authentication_1.AuthenticationMiddleware, multer_1.default.single('image-profile')], profile_controller_1.create_profile);
router.route('/update-profile').put([Authentication_1.AuthenticationMiddleware, multer_1.default.single('image-profile')], profile_controller_1.update_profile);
router.route('/get-profile/:id').get([Authentication_1.AuthenticationMiddleware], profile_controller_1.get_profile);
router.route('/delete-profile').delete([Authentication_1.AuthenticationMiddleware], profile_controller_1.delete_profile);
exports.default = router;
