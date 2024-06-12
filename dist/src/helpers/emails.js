"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailForgotPassword = exports.sendEmailRegister = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const sendEmailRegister = async (data) => {
    const { email, name, token } = data;
    const options = {
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    };
    const transport = nodemailer_1.default.createTransport(options);
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

                    <p

                    >
                        Tu cuenta esta casi lista. Continua con el siguente link:
    
                        <a
                            style="font-size:14px; color: #1574FF; font-family: sans-serif; font-weight: normal"
                            href="${process.env.FRONTEND_URL}/confirm/${token}">Click here
                        </a>
                    </p>
    
    
                    <p style="font-size:12px; color:#FF495C; font-family: sans-serif; font-weight: semibold">
                    <span style="color: #444444;">Nota:</span> 
                    si no creaste esta cuenta, por favor no des click en el link</p>
                </div>

            </div>
        `
    });
};
exports.sendEmailRegister = sendEmailRegister;
const sendEmailForgotPassword = async (data) => {
    const { email, name, token } = data;
    const options = {
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    };
    const transport = nodemailer_1.default.createTransport(options);
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
    });
};
exports.sendEmailForgotPassword = sendEmailForgotPassword;
