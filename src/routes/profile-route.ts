import express from 'express'
const router = express.Router()
import upload from '../middlewares/multer'

//controller
import { create_profile, update_profile, get_profile, delete_profile } from '../controllers/profile-controller'
//middleware
import { AuthenticationMiddleware } from '../middlewares/Authentication'


router.route('/create-profile').post([AuthenticationMiddleware, upload.single('image-profile')], create_profile)
router.route('/update-profile').put([AuthenticationMiddleware, upload.single('image-profile')], update_profile)
router.route('/get-profile/:id').get([AuthenticationMiddleware], get_profile)
router.route('/delete-profile').delete([AuthenticationMiddleware], delete_profile)

export default router