import { Request, Response } from 'express'
import prisma from '../lib/client'
import { Profile } from '../interfaces'
import cloudinary from '../cloudinary/cloudinary-img'


const create_profile = async (req: Request, res: Response) => {
    const { session_user } = req
    const { bio, country, education } = req.body as { bio: string, country: string, education: string, image?: string }
    const file = req.file as Express.Multer.File

    const user = await prisma.user.findUnique({ where: { id: session_user.id } })

    if (!user) {
        const error = new Error('Usuario no existe/Inicie sessión')
        return res.status(200).json({ msg: error.message })
    }

    if ([bio, country, education].includes('')) {
        const error = new Error('Campos vacios')
        return res.status(200).json({ msg: error.message })
    }

    const profile = await prisma.profile.findUnique({
        where: { userId: session_user.id }, select: { userId: true }
    })

    if (profile) {
        const error = new Error('Pefil ya creado')
        return res.status(400).json({ msg: error.message })
    }

    try {
        if (file) {
            const result = await cloudinary.uploader.upload(file.path, { folder: 'ayacuchano/profiles', format: 'auto' });
            const imageUrl = result.secure_url;

            const my_bio: Profile = await prisma.profile.create({
                data: {
                    bio: bio,
                    education: education,
                    country: country,
                    image: imageUrl ?? null,
                    user: {
                        connect: {
                            id: session_user.id
                        }
                    }
                }
            })

            res.status(201).json({ ok: true, my_bio })
        } else {

            const my_bio: Profile = await prisma.profile.create({
                data: {
                    bio: bio,
                    education: education,
                    country: country,
                    user: {
                        connect: {
                            id: session_user.id
                        }
                    }
                }
            })

            res.status(201).json({ ok: true, my_bio })
        }


    } catch (error) {
        res.status(500).json({ ErrorToCreateProfile: error })
    }
}

const update_profile = async (req: Request, res: Response) => {
    const { session_user } = req
    const { bio, education, country } = req.body as { bio: string, education: string, country: string, image?: string }
    const file = req.file as Express.Multer.File

    const user = await prisma.user.findUnique({
        where: { id: session_user.id }, select: { id: true }
    })
    const profile = await prisma.profile.findUnique({
        where: { userId: session_user.id }, select: { userId: true, image: true }
    })

    if (!user) {
        const error = new Error('User no existe')
        return res.status(400).json({ msg: error.message })
    }

    if (!profile) {
        const error = new Error('Perfil no existe')
        return res.status(400).json({ msg: error.message })
    }

    if (profile.userId !== user.id) {
        const error = new Error('Solo el usuario del perfil puede hacer esta acción')
        return res.status(400).json({ msg: error.message })
    }


    if ([bio, country, education].includes('')) {
        const error = new Error('Campos vacios')
        return res.status(200).json({ msg: error.message })
    }

    try {
        if (file) {
            if (profile.image) {
                const partes = profile.image.split('/')
                const public_id = partes[partes.length - 1].split('.')[0];
                await cloudinary.uploader.destroy(`ayacuchano/profiles/${public_id}`);
            }

            const result = await cloudinary.uploader.upload(file.path, { folder: 'ayacuchano/profiles' });
            const imageUrl = result.secure_url;

            const new_profile = await prisma.profile.update({
                where: { userId: session_user.id },
                data: {
                    bio: bio,
                    education: education,
                    country: country,
                    image: imageUrl ?? null,
                }
            })

            res.status(200).json({ ok: true })
        } else {
            const new_profile = await prisma.profile.update({
                where: { userId: session_user.id },
                data: {
                    bio: bio,
                    education: education,
                    country: country,
                }
            })

            res.status(200).json({ ok: true })
        }


    } catch (error) {
        res.status(500).json({ ErrorToUpdateProfile: error })
    }
}

const get_profile = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
        const user = await prisma.user.findUnique({
            where: { id: id },
            select: {
                Profile: true

            },
        })

        if (!user?.Profile || !user) {
            const error = new Error('Usuario / Perfil no existe')
            return res.status(400).json({ msg: error.message })
        }

        res.status(200).json(user)

    } catch (error) {
        res.status(500).json({ ErrorToGetProfile: error })
    }



}

const delete_profile = async (req: Request, res: Response) => {
    const { session_user } = req

    const user = await prisma.user.findUnique({
        where: { id: session_user.id }, select: { id: true }
    })
    const profile = await prisma.profile.findUnique({
        where: { userId: session_user.id }, select: { userId: true }
    })


    if (!user) {
        const error = new Error('Usuario no existe/No autenticado')
        return res.status(400).json({ msg: error.message })
    }

    if (!profile) {
        const error = new Error('Perfil no existe')
        return res.status(400).json({ msg: error.message })
    }

    if (profile.userId !== user.id) {
        const error = new Error('Solo el usuario del perfil puede hacer esta acción')
        return res.status(400).json({ msg: error.message })
    }

    try {
        const delete_profile = await prisma.profile.delete({
            where: { userId: session_user.id }
        })

        res.status(200).json({ ok: true })


    } catch (error) {
        res.status(500).json({ ErrorToDeleteProfile: error })
    }


}


export {
    create_profile,
    update_profile,
    get_profile,
    delete_profile
}