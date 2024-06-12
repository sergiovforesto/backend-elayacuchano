import { Request, Response } from 'express'
import prisma from '../lib/client'

const create_comments = async (req: Request, res: Response) => {
    const { session_user } = req
    const { content } = req.body as { content: string }
    const { postId } = req.params as { postId: string }

    const user = await prisma.user.findUnique({
        where: { id: session_user.id }, select: { id: true }
    })

    const post = await prisma.post.findUnique({
        where: { id: postId }, select: { id: true }
    })

    if (!user || !session_user) {
        const error = new Error('Usuario no existe/Inicie sessión')
        return res.status(400).json({ msg: error.message })
    }

    if (!post) {
        const error = new Error('Post no encontrado')
        return res.status(400).json({ msg: error.message })
    }

    const max_length = 1000;
    if (content.length > max_length) {
        const error = new Error('Máximo 1000 caracteres')
        return res.status(400).json({ msg: error.message })
    }

    try {
        const comment = await prisma.comments.create({
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
        })

        res.status(201).json({ ok: true, comment })

    } catch (error) {
        res.status(500).json({ ErrorTocreateComment: error })
    }
}

const update_comments = async (req: Request, res: Response) => {
    const { session_user } = req
    const { postId, commentId } = req.params as { postId: string, commentId: string };
    const { content } = req.body as { content: string }

    const post = await prisma.post.findFirst({
        where: { id: postId }, select: { id: true }
    })

    const comment = await prisma.comments.findFirst({
        where: { id: commentId }, select: { id: true, authorId: true }
    })

    const pass = !post ? 'Post no existe' : (!comment ? 'Comentario no existe' : '');


    if (pass) {
        const error = new Error(pass)
        return res.status(400).json({ msg: error.message })
    }

    if (comment?.authorId !== session_user.id) {
        const error = new Error('Solo el autor tiene acceso a esta acción')
        return res.status(400).json({ msg: error.message })
    }

    if (!content) {
        const error = new Error('Debes introducir un comentario si deseas modificar')
        return res.status(400).json({ msg: error.message })
    }


    try {
        const new_comment = await prisma.comments.update({
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
        })

        res.status(200).json({ ok: true, new_comment })

    } catch (error) {
        res.status(500).json({ ErrorToUpdateComment: error })
    }


}


const delete_comments = async (req: Request, res: Response) => {
    const { session_user } = req
    const { postId, commentId } = req.params as { postId: string, commentId: string };
    const { isHidden } = req.body as { isHidden: boolean }

    const post = await prisma.post.findFirst({
        where: { id: postId }, select: { id: true }
    })

    const comment = await prisma.comments.findFirst({
        where: { id: commentId }, select: { id: true, authorId: true }
    })

    const pass = !post ? 'Post no existe' : (!comment ? 'Comentario no existe' : '');


    if (pass) {
        const error = new Error(pass)
        return res.status(400).json({ msg: error.message })
    }

    if (comment?.authorId !== session_user.id) {
        const error = new Error('Solo el autor tiene acceso a esta acción')
        return res.status(400).json({ msg: error.message })
    }




    try {
        const new_comment = await prisma.comments.update({
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
        })

        res.status(200).json({ ok: true, new_comment })

    } catch (error) {
        res.status(500).json({ ErrorToUpdateComment: error })
    }

}


const get_comments_by_post = async (req: Request, res: Response) => {
    const { postId } = req.params as { postId: string }


    try {

        const comments = await prisma.comments.findMany({
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

        })


        const commentCount = await prisma.comments.count({
            where: { postId: postId },

            orderBy: {
                createdAt: 'desc',
            },
        })



        res.status(200).json({ ok: true, commentCount, comments })


    } catch (error) {
        res.status(500).json({ ErrorToGeListComments: error })
    }



}


export {
    create_comments,
    update_comments,
    delete_comments,
    get_comments_by_post

}