import express from 'express'
const router = express.Router()

//controllers
import {
    get_all_users, create_user, confirm_user_by_token, login_user, logout_user,
    send_email_change_password, valid_token_change_password, new_password, session_user
}
    from '../controllers/users-controller'

//middlewares
import { AuthenticationMiddleware } from '../middlewares/Authentication'
import { isEmptyToRegister, existEmail, validPassword } from '../middlewares/validFields'


router.route('/create-user').post([
    isEmptyToRegister,
    existEmail,
    validPassword
], create_user)

router.route('/confirm-user/:token').get(confirm_user_by_token)

router.route('/login-user').post(login_user)
router.route('/logout-user').put([AuthenticationMiddleware], logout_user)

router.route('/change-password').post(send_email_change_password)
router.route('/change-password/:token')
    .get(valid_token_change_password)
    .post([validPassword], new_password)

//Private
router.route('/session').get([AuthenticationMiddleware], session_user)

router.route('/get-all-users').get([AuthenticationMiddleware], get_all_users)




export default router