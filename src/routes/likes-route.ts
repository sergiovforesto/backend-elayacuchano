import express from 'express'
const router = express.Router()

//Controller
import { new_like, } from '../controllers/likes-controller'

//middleware
import { AuthenticationMiddleware } from '../middlewares/Authentication'

router.route('/new-like/:postId').post([AuthenticationMiddleware], new_like)



export default router