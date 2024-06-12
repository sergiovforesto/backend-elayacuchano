"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_comments_by_post = exports.delete_comments = exports.update_comments = exports.create_comments = void 0;
const client_1 = __importDefault(require("../lib/client"));
const create_comments = async (req, res) => {
    const { session_user } = req;
    const { content } = req.body;
    const { postId } = req.params;
    const user = await client_1.default.user.findUnique({
        where: { id: session_user.id }, select: { id: true }
    });
    const post = await client_1.default.post.findUnique({
        where: { id: postId }, select: { id: true }
    });
    if (!user || !session_user) {
        const error = new Error('Usuario no existe/Inicie sessión');
        return res.status(400).json({ msg: error.message });
    }
    if (!post) {
        const error = new Error('Post no encontrado');
        return res.status(400).json({ msg: error.message });
    }
    const max_length = 1000;
    if (content.length > max_length) {
        const error = new Error('Máximo 1000 caracteres');
        return res.status(400).json({ msg: error.message });
    }
    try {
        const comment = await client_1.default.comments.create({
            data: {
                content: content,
                author: {
                    connect: {
                        id: session_user.id
                    }
                },
                post: {
                    connect: {
                        id: postId
                    }
                }
            }
        });
        res.status(201).json({ ok: true, comment });
    }
    catch (error) {
        res.status(500).json({ ErrorTocreateComment: error });
    }
};
exports.create_comments = create_comments;
const update_comments = async (req, res) => {
    const { session_user } = req;
    const { postId, commentId } = req.params;
    const { content } = req.body;
    const post = await client_1.default.post.findFirst({
        where: { id: postId }, select: { id: true }
    });
    const comment = await client_1.default.comments.findFirst({
        where: { id: commentId }, select: { id: true, authorId: true }
    });
    const pass = !post ? 'Post no existe' : (!comment ? 'Comentario no existe' : '');
    if (pass) {
        const error = new Error(pass);
        return res.status(400).json({ msg: error.message });
    }
    if (comment?.authorId !== session_user.id) {
        const error = new Error('Solo el autor tiene acceso a esta acción');
        return res.status(400).json({ msg: error.message });
    }
    if (!content) {
        const error = new Error('Debes introducir un comentario si deseas modificar');
        return res.status(400).json({ msg: error.message });
    }
    try {
        const new_comment = await client_1.default.comments.update({
            where: { id: comment.id },
            data: {
                content: content,
                author: {
                    connect: {
                        id: session_user.id
                    }
                },
                post: {
                    connect: {
                        id: postId
                    }
                }
            }
        });
        res.status(200).json({ ok: true, new_comment });
    }
    catch (error) {
        res.status(500).json({ ErrorToUpdateComment: error });
    }
};
exports.update_comments = update_comments;
const delete_comments = async (req, res) => {
    const { session_user } = req;
    const { postId, commentId } = req.params;
    const { isHidden } = req.body;
    const post = await client_1.default.post.findFirst({
        where: { id: postId }, select: { id: true }
    });
    const comment = await client_1.default.comments.findFirst({
        where: { id: commentId }, select: { id: true, authorId: true }
    });
    const pass = !post ? 'Post no existe' : (!comment ? 'Comentario no existe' : '');
    if (pass) {
        const error = new Error(pass);
        return res.status(400).json({ msg: error.message });
    }
    if (comment?.authorId !== session_user.id) {
        const error = new Error('Solo el autor tiene acceso a esta acción');
        return res.status(400).json({ msg: error.message });
    }
    try {
        const new_comment = await client_1.default.comments.update({
            where: { id: comment.id },
            data: {
                isHidden: isHidden,
                author: {
                    connect: {
                        id: session_user.id
                    }
                },
                post: {
                    connect: {
                        id: postId
                    }
                }
            }
        });
        res.status(200).json({ ok: true, new_comment });
    }
    catch (error) {
        res.status(500).json({ ErrorToUpdateComment: error });
    }
};
exports.delete_comments = delete_comments;
const get_comments_by_post = async (req, res) => {
    const { postId } = req.params;
    try {
        const comments = await client_1.default.comments.findMany({
            where: { postId: postId },
            include: {
                author: {
                    select: {
                        name: true,
                        lastName: true,
                        Profile: {
                            select: {
                                image: true
                            }
                        }
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        const commentCount = await client_1.default.comments.count({
            where: { postId: postId },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.status(200).json({ ok: true, commentCount, comments });
    }
    catch (error) {
        res.status(500).json({ ErrorToGeListComments: error });
    }
};
exports.get_comments_by_post = get_comments_by_post;
