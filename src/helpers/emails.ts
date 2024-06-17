import nodemailer, { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

interface Data {
    email: string;
    name: string;
    token: string;
}


export const sendEmailRegister = async (data: Data) => {

    const { email, name, token } = data

    const options: SMTPTransport.Options = {
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    };

    const transport: Transporter = nodemailer.createTransport(options);

    const infoEmail = await transport.sendMail({

        from: 'El ayacuchano - <account@elayacuchano.com>',
        to: email,
        subject: "Confirma tu cuenta para continuar", // asunto
        text: "El ayacuchano", // plain text body
        html: `
            <div>
                <div>
                    <p>
                        Bienvenido!  
                        <span style="color: #1574FF; font-size: 14px">${name}!</span>
                        Gracias por registrarte en ElAyacuchano
                    </p>

                    <strong>
                        Tu cuenta esta casi lista. Continua con el siguente link:

                        <a
                            style="font-size:14px; color: #1574FF; font-family: sans-serif; font-weight: normal"
                            href="${process.env.FRONTEND_URL}/confirm/${token}">Click here
                        </a>
                    </strong>


                    <p style="font-size:12px; color:#FF495C; font-family: sans-serif; font-weight: semibold">
                    <span style="color: #444444;">Nota:</span> 
                    si no creaste esta cuenta, por favor no des click en el link</p>
                </div>

            </div>
        `
    })
}



export const sendEmailForgotPassword = async (data: Data) => {

    const { email, name, token } = data

    const options: SMTPTransport.Options = {
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    };

    const transport: Transporter = nodemailer.createTransport(options);

    //informacion del Email
    const infoEmail = await transport.sendMail({
        from: 'El ayacuchano - <account@elayacuchano.com>',
        to: email,
        subject: "Reinicia tus contraseña",
        text: "Resetea tu contraseña en el ayacuchano",
        html: `

        <div
        >
            <div>
                <p>
                    Hola
                    <span style="color: #1574FF; font-size: 14px">${name}!</span>
                    Sigue los pasos para cambiar tu contraseña
                </p>

                <p
                >
                    Cambia tu contraseña en el siguiente link:

                    <a
                        style="font-size:14px; color: #1574FF; font-family: sans-serif; font-weight: normal"
                        href="${process.env.FRONTEND_URL}/new-password/${token}">
                        Cambia tu contraseña aqui
                    </a>
                </p>


                <p style="font-size:12px; color:#FF495C; font-family: sans-serif; font-weight: semibold">
                    <span style="color: #444444;">Nota:</span>
                    Si no creaste esta cuenta, por favor no des click en el siguiente link</p>
            </div>

        </div>
        `
    })
}