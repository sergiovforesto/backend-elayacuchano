import express from 'express'
const router = express.Router()
import upload from '../middlewares/multer'


//Controllers
import { create_post, get_post_id, update_post, delete_post, get_all_post, get_summary_stats, get_all_post_by_user } from '../controllers/posts-controller'

//Middlewares
import { AuthenticationMiddleware } from '../middlewares/Authentication'

router.route('/get-all-post').get([], get_all_post)
router.route('/get-all-post/:id').get([AuthenticationMiddleware], get_all_post_by_user)
router.route('/get-summary-stats').get([AuthenticationMiddleware], get_summary_stats)


router.route('/create-post').post([AuthenticationMiddleware, upload.array('images', 6)], create_post)
router.route('/get-post/:id').get([], get_post_id)
router.route('/update-post/:id').put([AuthenticationMiddleware, upload.array('images', 6)], update_post)
router.route('/delete-post/:id').delete([AuthenticationMiddleware], delete_post)







export default router