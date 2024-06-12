import { Request, Response } from 'express'
import prisma from '../lib/client'
import bcrypjs from 'bcryptjs';

import { User } from '../interfaces';
import { generateRandomCode } from '../helpers/generateRandomCode';
import { generateJWT } from '../helpers/generateJWT';
import { sendEmailRegister, sendEmailForgotPassword } from '../helpers/emails';



/*
La interfaz Request en Express con TypeScript puede tomar hasta tres parámetros genéricos: Request<ParamsDictionary, ResBody, ReqBody, Query>. Estos son:

ParamsDictionary: Define los parámetros de ruta o parámetros de consulta.
ResBody: Define el tipo de cuerpo de la respuesta.
ReqBody: Define el tipo de cuerpo de la petición.
Query: Define el tipo de la propiedad query del objeto Request.
Cuando ves Request<{}, {}, User>, los dos primeros {} son para ParamsDictionary y ResBody

segunda forma:  const { name, lastName, email, password } = req.body as User
*/


const create_user = async (req: Request<{}, {}, User>, res: Response) => {
    const { name, lastName, email, password } = req.body

    try {
        const register_user = await prisma.user.create({
            data: {
                name: name,
                lastName: lastName,
                email: email,
                password: bcrypjs.hashSync(password, 10),
                token: generateRandomCode()
            }
        })

        sendEmailRegister({
            email: register_user.email,
            name: register_user.name,
            token: register_user.token || ''
        })


        res.status(201).json({ ok: true })
    } catch (error) {
        const err = new Error('Error al crear usuario. Intente de nuevo')
        res.status(500).json({ msg: err.message })
    }


}

const confirm_user_by_token = async (req: Request, res: Response) => {
    const { token } = req.params as { token: string }

    const isToken = await prisma.user.findUnique({
        where: {
            token: token
        },
        select: {
            id: true,
            token: true,
            isAuth: true,
        }

    })

    if (!isToken) {
        const error = new Error('Token no disponible')
        return res.status(404).json({ msg: error.message })
    }

    try {
        const confirmToken = await prisma.user.update({
            where: {
                id: isToken.id
            },

            data: {
                token: null,
                isAuth: true,
                isActive: true

            }

        })

        res.status(200).json({ ok: true })
    } catch (error) {
        res.status(500).json({ ErrorToConfim: error })
    }

}



const login_user = async (req: Request, res: Response) => {
    const { email, password } = req.body as { email: string, password: string }

    const user = await prisma.user.findUnique({
        where: { email: email },
        select: {
            id: true,
            email: true,
            password: true,
            isAuth: true,
            inSession: true,
            token: true,
        }
    })

    if (!user) {
        const error = new Error('Usuario no existe')
        return res.status(400).json({ msg: error.message })
    }

    if (!user.isAuth) {
        const error = new Error('Usuario no autenticado')
        return res.status(400).json({ msg: error.message })
    }

    const validPassword = bcrypjs.compareSync(password, user.password)

    if (!validPassword) {
        const error = new Error('Contraseña no valida')
        return res.status(400).json({ msg: error.message })
    }

    await prisma.user.update({
        where: { email: email },
        data: {
            inSession: true
        }
    })

    const { password: userPassword, isAuth, email: userEmail, ...res_user } = user;
    res_user.token = generateJWT(user.id)




    res.status(200).json({ ok: true, user: res_user })
}


const logout_user = async (req: Request, res: Response) => {
    const { session_user } = req
    const { email } = req.body as { email: string }

    const user = await prisma.user.findUnique({
        where: { id: session_user.id },
        select: {
            inSession: true
        }
    })

    if (!user?.inSession) {
        const error = new Error('Usuario no esta en sesión')
        return res.status(400).json({ msg: error.message })
    }

    await prisma.user.update({
        where: { email: email },
        data: {
            inSession: false
        }
    })

    res.status(200).json({ ok: true })
}


const send_email_change_password = async (req: Request, res: Response) => {
    const { email } = req.body as { email: string }

    const user = await prisma.user.findUnique({
        where: { email: email },
        select: {
            email: true,
            isAuth: true,
            token: true
        }
    })

    if (!user) {
        const error = new Error('Email no existe')
        return res.status(400).json({ msg: error.message })
    }

    if (!user.isAuth) {
        const error = new Error('Usuario no autenticado')
        return res.status(400).json({ msg: error.message })
    }

    try {
        const sendToken = await prisma.user.update({
            where: { email: email },
            data: {
                token: generateRandomCode()
            }
        })


        sendEmailForgotPassword({
            email: sendToken.email,
            name: sendToken.name,
            token: sendToken.token || ''
        })

        res.status(200).json({ ok: true })
    } catch (error) {
        res.status(500).json({ errorTochangePassword: error })
    }

}


const valid_token_change_password = async (req: Request, res: Response) => {
    const { token } = req.params as { token: string }


    const user = await prisma.user.findUnique({
        where: { token: token },
        select: { token: true }
    })

    if (!user || user.token === null) {
        const error = new Error('Token no encontrado')
        return res.status(400).json({ msg: error.message })
    }

    try {
        if (user) res.status(200).json({ ok: true })

    } catch (error) {
        res.status(500).json({ ErrorToValidToken: error })
    }



}

const new_password = async (req: Request, res: Response) => {
    const { token } = req.params as { token: string }
    const { password } = req.body as { password: string }

    const user = await prisma.user.findUnique({
        where: { token: token },
        select: {
            token: true,
            password: true,
            email: true
        }
    })

    if (!user?.token || user?.token === null) {
        const error = new Error('Token no existe')
        return res.status(400).json({ msg: error.message })
    }

    const newPassword = password

    try {
        const user_password = await prisma.user.update({
            where: { email: user.email },
            select: {
                token: true,
                password: true
            },
            data: {
                token: null,
                password: bcrypjs.hashSync(newPassword)
            }
        })

        res.status(200).json({ ok: true })
    } catch (error) {
        res.status(500).json({ ErrorToCreateNewPassword: error })

    }



}


const session_user = async (req: Request, res: Response) => {

    const { session_user } = req
    try {
        if (session_user.id || session_user) {
            res.json(session_user)
        }
    } catch (error) {
        res.status(500).json({ ErrorToGetSession: error })
    }

}


const get_all_users = async (req: Request, res: Response) => {

    const { session_user } = req
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;

    const admin = await prisma.user.findUnique({
        where: { id: session_user.id }
    })

    if (admin?.role !== 'admin') {
        const error = new Error('No es Administrador')
        return res.status(400).json({ msg: error.message })
    }

    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                lastName: true,
                email: true,
                role: true,
                isAuth: true,
                inSession: true,
                createdAt: true
            },
            take: limit,
            skip: (page - 1) * limit,
            orderBy: {
                createdAt: 'desc',
            },
        })

        const totalUsers = await prisma.user.count()

        res.status(200).json({ ok: 'ok', totalUsers, users })
    } catch (error) {
        return res.status(500).json(error)
    }
}






export {
    create_user,
    confirm_user_by_token,
    login_user,
    logout_user,
    send_email_change_password,
    valid_token_change_password,
    new_password,
    session_user,
    get_all_users,

}

