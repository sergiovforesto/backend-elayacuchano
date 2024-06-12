import { Request, Response } from "express"
import cloudinary from "../cloudinary/cloudinary-img"



async function uploadImages(images: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[]): Promise<string[]> {
    const urls: string[] = [];

    if (Array.isArray(images)) {
        // Si images es un array, itera sobre él directamente
        for (const image of images) {

            const result = await cloudinary.uploader.upload(image.path, { folder: 'ayacuchano' });
            urls.push(result.secure_url);
            console.log(`Imagen subida exitosamente: ${result.secure_url}`);
        }
    } else {
        // Si images es un objeto, itera sobre cada campo
        for (const field in images) {
            for (const image of images[field]) {
                const result = await cloudinary.uploader.upload(image.path, { folder: 'ayacuchano' });
                urls.push(result.secure_url);
                console.log(`Imagen subida exitosamente: ${result.secure_url}`);
            }
        }
    }

    return urls;
}




const upload_image_cloudinary = async (req: Request, res: Response) => {
    const images = req.files

    try {

        if (!images) {
            const error = new Error('No hay archivos para subir')
            return res.status(400).json({ msg: error.message })
        }

        const url_images = await uploadImages(images)

        res.status(200).json({ ok: true, url_images })

        //Example con una imagen
        // if (images) {    
        //     await cloudinary.uploader.upload(images, { folder: 'ayacuchano' }, (err, result) => {
        //         // if (err) {
        //         //     res.status(500).json({ ErrorCloudinary: err })
        //         // }
        //         return res.status(201).json({
        //             ok: true,
        //             images_url: result
        //         })
        //     })
        // }

    } catch (error) {
        res.status(500).json({ ErrorToUploadImage: error })
    }
}

const destroy_image_cloudinary = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string }


    try {
        await cloudinary.uploader.destroy(`ayacuchano/${id}`, (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).json(err)
            }

            return res.status(200).json({
                ok: true,
                message: result
            })
        })

    } catch (error) {
        res.status(500).json({ ErrorToDeleteImage: error })
    }

}

export {
    upload_image_cloudinary,
    destroy_image_cloudinary
}