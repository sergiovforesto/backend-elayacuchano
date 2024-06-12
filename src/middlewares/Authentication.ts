import { Response, Request, NextFunction } from "express"
import jwt, { JwtPayload } from 'jsonwebtoken'
import prisma from "../lib/client"

const AuthenticationMiddleware = async (req: Request, res: Response, next: NextFunction) => {

    const requestHeaders = req.headers.authorization

    if (!requestHeaders || !requestHeaders.startsWith('Bearer')) {
        const error = new Error('Autorización no valida')
        return res.status(404).json({ msg: error.message })
    }

    const token = requestHeaders.split(' ')[1]


    const verifiedToken = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;


    try {
        const session = await prisma.user.findUnique({
            where: { id: verifiedToken.id },
            select: { id: true, name: true, lastName: true, email: true, role: true }
        })

        if (!session) {
            const error = new Error('JWT Invalido')
            return res.status(400).json({ msg: error.message })
        }

        //new property to request
        req.session_user = session

        next()
    } catch (error) {
        res.status(500).json({ AuthorizationError: error })
    }


}



export {
    AuthenticationMiddleware
}