import express from 'express'
const router = express.Router()

//controller
import { create_comments, update_comments, delete_comments, get_comments_by_post } from '../controllers/comments-controller'

//middlewares
import { AuthenticationMiddleware } from '../middlewares/Authentication'

router.route('/get-comment-list/:postId').get([], get_comments_by_post)
router.route('/create-comment/:postId').post([AuthenticationMiddleware], create_comments)
router.route('/update-comment/:postId/:commentId').put([AuthenticationMiddleware], update_comments)
router.route('/delete-comment/:postId/:commentId').put([AuthenticationMiddleware], delete_comments)

export default router