"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
//controllers
const users_controller_1 = require("../controllers/users-controller");
//middlewares
const Authentication_1 = require("../middlewares/Authentication");
const validFields_1 = require("../middlewares/validFields");
router.route('/create-user').post([
    validFields_1.isEmptyToRegister,
    validFields_1.existEmail,
    validFields_1.validPassword
], users_controller_1.create_user);
router.route('/confirm-user/:token').get(users_controller_1.confirm_user_by_token);
router.route('/login-user').post(users_controller_1.login_user);
router.route('/logout-user').put([Authentication_1.AuthenticationMiddleware], users_controller_1.logout_user);
router.route('/change-password').post(users_controller_1.send_email_change_password);
router.route('/change-password/:token')
    .get(users_controller_1.valid_token_change_password)
    .post([validFields_1.validPassword], users_controller_1.new_password);
//Private
router.route('/session').get([Authentication_1.AuthenticationMiddleware], users_controller_1.session_user);
router.route('/get-all-users').get([Authentication_1.AuthenticationMiddleware], users_controller_1.get_all_users);
exports.default = router;
