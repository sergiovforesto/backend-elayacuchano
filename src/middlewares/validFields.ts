import { Response, Request, NextFunction } from "express"
import prisma from "../lib/client"
import { User } from "../interfaces"

const isEmptyToRegister = async (req: Request, res: Response, next: NextFunction) => {
    const { ...fields } = req.body as User

    if (Object.values(fields).includes('')) {
        const error = new Error('Ningun Campo debe estar vacio')
        return res.status(400).json({ msg: error.message })
    }


    if (fields.name.length > 30 || fields.lastName.length > 30) {
        const error = new Error('Nombre y Apellido muy largo. 30 caracteres max.')
        return res.status(400).json({ msg: error.message })
    }

    next()
}

const validPassword = async (req: Request, res: Response, next: NextFunction) => {
    const { password } = req.body as { password: string }

    /*
        -Asegura que haya al menos un dígito
        -Asegura que haya al menos una letra mayúscula y Minuscula
        -Asegura que haya al menos un carácter especial (no alfanumérico)
        -Asegura que la longitud de la contraseña esté entre 8 y 32 caracteres
    */
    const isStrongPassword = /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^0-9A-Za-z]).{8,32}$/

    if (!isStrongPassword.test(password)) {
        const error = new Error('Contraseña debil')
        return res.status(400).json({ msg: error.message })
    }


    next()

}


const existEmail = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body as { email: string }

    const isEmail = await prisma.user.findUnique({
        where: {
            email: email
        }
    })

    if (isEmail) {
        const error = new Error('Este email existe. Intente con otro email')
        return res.status(400).json({ msg: error.message })
    }


    next()



}

export {
    isEmptyToRegister,
    existEmail,
    validPassword
}