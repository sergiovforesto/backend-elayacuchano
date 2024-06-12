"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.new_like = void 0;
const client_1 = __importDefault(require("../lib/client"));
const new_like = async (req, res) => {
    const { session_user } = req;
    const { postId } = req.params;
    const { likes } = req.body;
    try {
        const post = await client_1.default.post.findUnique({
            where: { id: postId },
            include: {
                Likes: {
                    select: {
                        id: true,
                        likes: true,
                        isClicked: true,
                        userId: true,
                    }
                }
            }
        });
        if (!post) {
            return res.status(400).json({ msg: `El post con el ID ${postId} no existe` });
        }
        const existingLike = post.Likes.find((like) => like.userId === session_user.id);
        if (existingLike) {
            if (existingLike.likes > 0) {
                await client_1.default.likes.update({
                    where: { id: existingLike.id },
                    data: {
                        likes: existingLike.likes - 1,
                        isClicked: false,
                    },
                });
            }
            else {
                await client_1.default.likes.update({
                    where: { id: existingLike.id },
                    data: {
                        likes: existingLike.likes + 1,
                        isClicked: true,
                    },
                });
            }
        }
        else {
            // Crea un nuevo like
            await client_1.default.likes.create({
                data: {
                    likes: +likes,
                    isClicked: true,
                    post: { connect: { id: postId } },
                    user: { connect: { id: session_user.id } },
                },
            });
        }
        res.status(201).json({ ok: true });
    }
    catch (error) {
        res.status(500).json({ ErrorToAddLike: error });
    }
};
exports.new_like = new_like;
