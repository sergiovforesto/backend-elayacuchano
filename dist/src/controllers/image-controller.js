"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.destroy_image_cloudinary = exports.upload_image_cloudinary = void 0;
const cloudinary_img_1 = __importDefault(require("../cloudinary/cloudinary-img"));
async function uploadImages(images) {
    const urls = [];
    if (Array.isArray(images)) {
        // Si images es un array, itera sobre él directamente
        for (const image of images) {
            const result = await cloudinary_img_1.default.uploader.upload(image.path, { folder: 'ayacuchano' });
            urls.push(result.secure_url);
            console.log(`Imagen subida exitosamente: ${result.secure_url}`);
        }
    }
    else {
        // Si images es un objeto, itera sobre cada campo
        for (const field in images) {
            for (const image of images[field]) {
                const result = await cloudinary_img_1.default.uploader.upload(image.path, { folder: 'ayacuchano' });
                urls.push(result.secure_url);
                console.log(`Imagen subida exitosamente: ${result.secure_url}`);
            }
        }
    }
    return urls;
}
const upload_image_cloudinary = async (req, res) => {
    const images = req.files;
    try {
        if (!images) {
            const error = new Error('No hay archivos para subir');
            return res.status(400).json({ msg: error.message });
        }
        const url_images = await uploadImages(images);
        res.status(200).json({ ok: true, url_images });
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
    }
    catch (error) {
        res.status(500).json({ ErrorToUploadImage: error });
    }
};
exports.upload_image_cloudinary = upload_image_cloudinary;
const destroy_image_cloudinary = async (req, res) => {
    const { id } = req.params;
    try {
        await cloudinary_img_1.default.uploader.destroy(`ayacuchano/${id}`, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json(err);
            }
            return res.status(200).json({
                ok: true,
                message: result
            });
        });
    }
    catch (error) {
        res.status(500).json({ ErrorToDeleteImage: error });
    }
};
exports.destroy_image_cloudinary = destroy_image_cloudinary;
