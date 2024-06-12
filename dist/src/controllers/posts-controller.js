"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_all_post_by_user = exports.get_summary_stats = exports.delete_post = exports.update_post = exports.get_all_post = exports.get_post_id = exports.create_post = void 0;
const client_1 = __importDefault(require("../lib/client"));
const cloudinary_img_1 = __importDefault(require("../cloudinary/cloudinary-img"));
const create_post = async (req, res) => {
    const { session_user } = req;
    const { title, description } = req.body;
    const imageUrl = req.files;
    const user = await client_1.default.user.findUnique({ where: { id: session_user.id }, select: { id: true } });
    if (!user) {
        const error = new Error('Registrate e inicia sessión para crear postear');
        return res.status(400).json({ msg: error.message });
    }
    try {
        const post = await client_1.default.post.create({
            data: {
                title: title,
                description: description,
                author: {
                    connect: {
                        id: session_user.id
                    }
                }
            }
        });
        const imagePromises = imageUrl.map(async (image) => {
            // Sube la imagen a Cloudinary y obtén la URL
            const result = await cloudinary_img_1.default.uploader.upload(image.path, { folder: 'ayacuchano' });
            const imageUrl = result.secure_url;
            // Crea un registro de imagen en la base de datos con la URL de la imagen
            return client_1.default.images.create({
                data: {
                    url: imageUrl,
                    postId: post.id,
                },
            });
        });
        const imageRecords = await Promise.all(imagePromises);
        res.status(201).json({ ok: true, post });
    }
    catch (error) {
        res.status(400).json({ ErrorToCreatePost: error });
    }
};
exports.create_post = create_post;
const get_post_id = async (req, res) => {
    const { id } = req.params;
    try {
        const post = await client_1.default.post.findUnique({
            where: { id: id },
            include: {
                Images: true,
                Comments: true,
                Likes: { select: { id: true, userId: true, postId: true, likes: true, isClicked: true } },
                author: {
                    select: {
                        name: true,
                        lastName: true,
                        Profile: {
                            select: {
                                image: true
                            }
                        }
                    }
                }
            }
        });
        if (!post) {
            const error = new Error(`Post id: '${id}' no existe`);
            return res.status(500).json(error.message);
        }
        res.status(200).json({ ok: true, post });
    }
    catch (error) {
        res.status(500).json({ ErrorToGetPost: error });
    }
};
exports.get_post_id = get_post_id;
const update_post = async (req, res) => {
    const { session_user } = req;
    const { id } = req.params;
    const { title, description } = req.body;
    const files = req.files;
    if (!id) {
        return res.status(400).json({ msg: 'El ID del post no está definido.' });
    }
    const post = await client_1.default.post.findUnique({ where: { id: id }, include: { Images: true } });
    if (!post) {
        const error = new Error(`Post Id: ${id} no existe`);
        return res.status(400).json({ msg: error.message });
    }
    if (post.authorId !== session_user.id) {
        const error = new Error('Solo el autor del post puede hacer esta acción');
        return res.status(400).json({ msg: error.message });
    }
    try {
        if (files.length >= 1) {
            // Borrar imágenes antiguas de Cloudinary y la base de datos
            if (post.Images.length >= 1) {
                // Borrar imágenes de Cloudinary
                const deleteImagesPromises = post.Images.map((img) => {
                    const partes = img.url.split('/');
                    const public_id = partes[partes.length - 1].split('.')[0];
                    return cloudinary_img_1.default.uploader.destroy(`ayacuchano/${public_id}`);
                });
                // Borrar registros de imágenes de la base de datos
                const deleteImagesDBPromises = post.Images.map((img) => {
                    return client_1.default.images.delete({
                        where: { id: img.id },
                    });
                });
                // Esperar a que todas las promesas de borrado se completen
                await Promise.all([...deleteImagesPromises, ...deleteImagesDBPromises]);
            }
            // Actualizar el post
            const new_Post = await client_1.default.post.update({
                where: { id: post.id },
                data: {
                    title: title,
                    description: description,
                },
            });
            // Subir nuevas imágenes y crear registros en la base de datos
            const imagePromises = files.map(async (image) => {
                const result = await cloudinary_img_1.default.uploader.upload(image.path, { folder: 'ayacuchano' });
                const imageUrl = result.secure_url;
                return client_1.default.images.create({
                    data: {
                        url: imageUrl,
                        post: {
                            connect: { id: new_Post.id },
                        },
                    },
                });
            });
            // Esperar a que todas las promesas de subida de imágenes se completen
            await Promise.all(imagePromises);
            res.status(200).json({ ok: true });
        }
        else {
            // Actualizar el post sin cambiar imágenes
            const new_Post = await client_1.default.post.update({
                where: { id: post.id },
                data: {
                    title: title,
                    description: description,
                },
            });
            res.status(200).json({ ok: true, new_Post });
        }
    }
    catch (error) {
        res.status(500).json({ ErrorToUpdatePost: error });
    }
};
exports.update_post = update_post;
const delete_post = async (req, res) => {
    const { session_user } = req;
    const { id } = req.params;
    const user = await client_1.default.user.findUnique({ where: { id: session_user.id }, select: { id: true } });
    const post = await client_1.default.post.findUnique({ where: { id: id }, include: { Images: true } });
    if (!user) {
        const error = new Error('User no existe/Inicia Sessión');
        return res.status(400).json({ msg: error.message });
    }
    if (!post) {
        const error = new Error(`Post Id: ${id} no existe`);
        return res.status(400).json({ msg: error.message });
    }
    if (post.authorId !== session_user.id) {
        const error = new Error('Solo el autor del post puede hacer esta acción');
        return res.status(400).json({ msg: error.message });
    }
    try {
        const post = await client_1.default.post.findUnique({
            where: { id: id },
            include: { Images: true }
        });
        if (!post) {
            return res.status(404).json({ msg: `Post Id: ${id} no existe` });
        }
        if (post.authorId !== session_user.id) {
            return res.status(403).json({ msg: 'Solo el autor del post puede hacer esta acción' });
        }
        // Borrar imágenes de Cloudinary y registros de la base de datos
        if (post.Images.length > 0) {
            const deleteImagesPromises = post.Images.map(img => {
                const partes = img.url.split('/');
                const public_id = partes[partes.length - 1].split('.')[0];
                return cloudinary_img_1.default.uploader.destroy(`ayacuchano/${public_id}`);
            });
            const deleteImagesDBPromises = post.Images.map(img => {
                return client_1.default.images.delete({ where: { id: img.id } });
            });
            await Promise.all([...deleteImagesPromises, ...deleteImagesDBPromises]);
        }
        // Borrar likes y comentarios asociados al post
        await client_1.default.likes.deleteMany({ where: { postId: id } });
        await client_1.default.comments.deleteMany({ where: { postId: id } });
        // Finalmente, borrar el post
        await client_1.default.post.delete({ where: { id: id } });
        res.status(200).json({ ok: true, msg: 'Post eliminado correctamente' });
    }
    catch (error) {
        res.status(500).json({ ErrorToDeletePost: error });
    }
};
exports.delete_post = delete_post;
const get_all_post = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    try {
        const users = await client_1.default.user.findMany();
        const posts = await client_1.default.post.findMany({
            take: limit,
            skip: (page - 1) * limit,
            include: {
                Images: {
                    take: 1
                },
                Likes: { select: { id: true, userId: true, postId: true, likes: true, isClicked: true } },
                author: {
                    select: {
                        Profile: {
                            select: {
                                image: true
                            }
                        }
                    }
                },
                Comments: { select: { id: true } }
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        const totalPosts = await client_1.default.post.count();
        const newPosts = posts.map((post) => {
            const user = users.find((u) => u.id === post.authorId);
            const authorName = user ? `${user.name} ${user.lastName}` : '';
            const totalComments = post.Comments.length;
            return { ...post, authorName, totalComments };
        });
        res.status(200).json({ ok: true, totalPosts, posts: newPosts, });
    }
    catch (error) {
        res.status(500).json({ ErrorToGetAllPost: error });
    }
};
exports.get_all_post = get_all_post;
const get_summary_stats = async (req, res) => {
    const { session_user } = req;
    try {
        const totalPost = await client_1.default.post.count({
            where: { authorId: session_user.id }
        });
        const totalComments = await client_1.default.comments.count({
            where: { authorId: session_user.id }
        });
        const totalLikes = await client_1.default.likes.count({
            where: { userId: session_user.id }
        });
        res.status(200).json({
            ok: true,
            totalPost,
            totalComments,
            totalLikes
        });
    }
    catch (error) {
        res.status(500).json({ ErrorToGetSummaryStats: error });
    }
};
exports.get_summary_stats = get_summary_stats;
const get_all_post_by_user = async (req, res) => {
    const { session_user } = req;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    try {
        const posts = await client_1.default.post.findMany({
            where: { authorId: session_user.id },
            take: limit,
            skip: (page - 1) * limit,
            orderBy: {
                createdAt: 'desc',
            },
        });
        const totalPosts = await client_1.default.post.count({
            where: { authorId: session_user.id }
        });
        res.status(200).json({ ok: true, totalPosts, posts });
    }
    catch (error) {
        res.status(500).json({ ErrorToGetAllPostByUser: error });
    }
};
exports.get_all_post_by_user = get_all_post_by_user;
