import express from 'express'
const router = express.Router()
import upload from '../middlewares/multer'

//controller
import { upload_image_cloudinary, destroy_image_cloudinary } from '../controllers/image-controller'

//Middleware
import { AuthenticationMiddleware } from '../middlewares/Authentication'

router.route('/upload-image').post([AuthenticationMiddleware, upload.array('images', 3)], upload_image_cloudinary)

router.route('/delete-image/:id').delete([AuthenticationMiddleware,], destroy_image_cloudinary)


export default router