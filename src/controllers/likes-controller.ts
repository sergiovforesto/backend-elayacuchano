import { Request, Response } from "express";
import prisma from "../lib/client"


const new_like = async (req: Request, res: Response) => {
    const { session_user } = req
    const { postId } = req.params as { postId: string }
    const { likes } = req.body as { likes: number }


    try {
        const post = await prisma.post.findUnique({
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
                await prisma.likes.update({
                    where: { id: existingLike.id },
                    data: {
                        likes: existingLike.likes - 1,
                        isClicked: false,
                    },
                });
            } else {
                await prisma.likes.update({
                    where: { id: existingLike.id },
                    data: {
                        likes: existingLike.likes + 1,
                        isClicked: true,
                    },
                });
            }
        } else {
            // Crea un nuevo like
            await prisma.likes.create({
                data: {
                    likes: +likes,
                    isClicked: true,
                    post: { connect: { id: postId } },
                    user: { connect: { id: session_user.id } },
                },
            });
        }

        res.status(201).json({ ok: true });




    } catch (error) {
        res.status(500).json({ ErrorToAddLike: error })
    }

}





export {
    new_like,
}


