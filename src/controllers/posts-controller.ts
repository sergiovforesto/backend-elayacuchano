import { Request, Response } from "express"
import prisma from "../lib/client"
import { Post } from "../interfaces"
import cloudinary from "../cloudinary/cloudinary-img"


const create_post = async (req: Request, res: Response) => {

    const { session_user } = req
    const { title, description } = req.body as Post
    const imageUrl = req.files as Express.Multer.File[];

    const user = await prisma.user.findUnique({ where: { id: session_user.id }, select: { id: true } })

    if (!user) {
        const error = new Error('Registrate e inicia sessión para crear postear')
        return res.status(400).json({ msg: error.message })
    }


    try {

        const post: Post = await prisma.post.create({
            data: {
                title: title,
                description: description,
                author: {
                    connect: {
                        id: session_user.id
                    }
                }
            }
        })

        const imagePromises = imageUrl.map(async (image) => {
            // Sube la imagen a Cloudinary y obtén la URL
            const result = await cloudinary.uploader.upload(image.path, { folder: 'ayacuchano' });
            const imageUrl = result.secure_url;

            // Crea un registro de imagen en la base de datos con la URL de la imagen
            return prisma.images.create({
                data: {
                    url: imageUrl,
                    postId: post.id,
                },
            });
        });

        const imageRecords = await Promise.all(imagePromises);


        res.status(201).json({ ok: true, post })


    } catch (error) {
        res.status(400).json({ ErrorToCreatePost: error })
    }



}

const get_post_id = async (req: Request, res: Response) => {
    const { id } = req.params as { id: string }


    try {

        const post = await prisma.post.findUnique({
            where: { id: id },
            include: {
                Images: true,
                Comments: true,
                Likes: { select: { id: true, userId: true, postId: true, likes: true, isClicked: true } },
                author: {
                    select:
                    {
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
        })


        if (!post) {
            const error = new Error(`Post id: '${id}' no existe`)
            return res.status(500).json(error.message)
        }

        res.status(200).json({ ok: true, post })

    } catch (error) {
        res.status(500).json({ ErrorToGetPost: error })
    }
}



const update_post = async (req: Request, res: Response) => {

    const { session_user } = req
    const { id } = req.params as { id: string }
    const { title, description } = req.body as Post
    const files = req.files as Express.Multer.File[];

    if (!id) {
        return res.status(400).json({ msg: 'El ID del post no está definido.' });
    }

    const post = await prisma.post.findUnique({ where: { id: id }, include: { Images: true } })

    if (!post) {
        const error = new Error(`Post Id: ${id} no existe`)
        return res.status(400).json({ msg: error.message })
    }

    if (post.authorId !== session_user.id) {
        const error = new Error('Solo el autor del post puede hacer esta acción')
        return res.status(400).json({ msg: error.message })
    }


    try {


        if (files.length >= 1) {
            // Borrar imágenes antiguas de Cloudinary y la base de datos
            if (post.Images.length >= 1) {
                // Borrar imágenes de Cloudinary
                const deleteImagesPromises = post.Images.map((img) => {
                    const partes = img.url.split('/');
                    const public_id = partes[partes.length - 1].split('.')[0];
                    return cloudinary.uploader.destroy(`ayacuchano/${public_id}`);
                });

                // Borrar registros de imágenes de la base de datos
                const deleteImagesDBPromises = post.Images.map((img) => {
                    return prisma.images.delete({
                        where: { id: img.id },
                    });
                });

                // Esperar a que todas las promesas de borrado se completen
                await Promise.all([...deleteImagesPromises, ...deleteImagesDBPromises]);
            }

            // Actualizar el post
            const new_Post = await prisma.post.update({
                where: { id: post.id },
                data: {
                    title: title,
                    description: description,
                },
            });

            // Subir nuevas imágenes y crear registros en la base de datos
            const imagePromises = files.map(async (image) => {
                const result = await cloudinary.uploader.upload(image.path, { folder: 'ayacuchano' });
                const imageUrl = result.secure_url;

                return prisma.images.create({
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
        } else {
            // Actualizar el post sin cambiar imágenes
            const new_Post = await prisma.post.update({
                where: { id: post.id },
                data: {
                    title: title,
                    description: description,
                },
            });

            res.status(200).json({ ok: true, new_Post });
        }


    } catch (error) {
        res.status(500).json({ ErrorToUpdatePost: error })
    }

}

const delete_post = async (req: Request, res: Response) => {
    const { session_user } = req
    const { id } = req.params as { id: string }

    const user = await prisma.user.findUnique({ where: { id: session_user.id }, select: { id: true } })
    const post = await prisma.post.findUnique({ where: { id: id }, include: { Images: true } })


    if (!user) {
        const error = new Error('User no existe/Inicia Sessión')
        return res.status(400).json({ msg: error.message })
    }

    if (!post) {
        const error = new Error(`Post Id: ${id} no existe`)
        return res.status(400).json({ msg: error.message })
    }

    if (post.authorId !== session_user.id) {
        const error = new Error('Solo el autor del post puede hacer esta acción')
        return res.status(400).json({ msg: error.message })
    }

    try {
        const post = await prisma.post.findUnique({
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
                return cloudinary.uploader.destroy(`ayacuchano/${public_id}`);
            });

            const deleteImagesDBPromises = post.Images.map(img => {
                return prisma.images.delete({ where: { id: img.id } });
            });

            await Promise.all([...deleteImagesPromises, ...deleteImagesDBPromises]);
        }

        // Borrar likes y comentarios asociados al post
        await prisma.likes.deleteMany({ where: { postId: id } });
        await prisma.comments.deleteMany({ where: { postId: id } });

        // Finalmente, borrar el post
        await prisma.post.delete({ where: { id: id } });

        res.status(200).json({ ok: true, msg: 'Post eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ ErrorToDeletePost: error });
    }
};


const get_all_post = async (req: Request, res: Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;

    try {
        const users = await prisma.user.findMany()
        const posts = await prisma.post.findMany({
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

        })

        const totalPosts = await prisma.post.count()

        const newPosts = posts.map((post) => {
            const user = users.find((u) => u.id === post.authorId);
            const authorName = user ? `${user.name} ${user.lastName}` : '';


            const totalComments = post.Comments.length
            return { ...post, authorName, totalComments };
        });

        res.status(200).json({ ok: true, totalPosts, posts: newPosts, })

    } catch (error) {
        res.status(500).json({ ErrorToGetAllPost: error })
    }
}

const get_summary_stats = async (req: Request, res: Response) => {

    const { session_user } = req

    try {
        const totalPost = await prisma.post.count({
            where: { authorId: session_user.id }
        })

        const totalComments = await prisma.comments.count({
            where: { authorId: session_user.id }
        })

        const totalLikes = await prisma.likes.count({
            where: { userId: session_user.id }
        })


        res.status(200).json({
            ok: true,
            totalPost,
            totalComments,
            totalLikes

        })

    } catch (error) {
        res.status(500).json({ ErrorToGetSummaryStats: error })

    }

}

const get_all_post_by_user = async (req: Request, res: Response) => {
    const { session_user } = req
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;

    try {

        const posts = await prisma.post.findMany({
            where: { authorId: session_user.id },
            take: limit,
            skip: (page - 1) * limit,
            orderBy: {
                createdAt: 'desc',
            },

        })

        const totalPosts = await prisma.post.count({
            where: { authorId: session_user.id }
        })

        res.status(200).json({ ok: true, totalPosts, posts })
    } catch (error) {
        res.status(500).json({ ErrorToGetAllPostByUser: error })

    }

}



export {
    create_post,
    get_post_id,
    get_all_post,
    update_post,
    delete_post,
    get_summary_stats,
    get_all_post_by_user
}