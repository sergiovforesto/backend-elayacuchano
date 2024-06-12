"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validPassword = exports.existEmail = exports.isEmptyToRegister = void 0;
const client_1 = __importDefault(require("../lib/client"));
const isEmptyToRegister = async (req, res, next) => {
    const { ...fields } = req.body;
    if (Object.values(fields).includes('')) {
        const error = new Error('Ningun Campo debe estar vacio');
        return res.status(400).json({ msg: error.message });
    }
    if (fields.name.length > 30 || fields.lastName.length > 30) {
        const error = new Error('Nombre y Apellido muy largo. 30 caracteres max.');
        return res.status(400).json({ msg: error.message });
    }
    next();
};
exports.isEmptyToRegister = isEmptyToRegister;
const validPassword = async (req, res, next) => {
    const { password } = req.body;
    /*
        -Asegura que haya al menos un dígito
        -Asegura que haya al menos una letra mayúscula y Minuscula
        -Asegura que haya al menos un carácter especial (no alfanumérico)
        -Asegura que la longitud de la contraseña esté entre 8 y 32 caracteres
    */
    const isStrongPassword = /^(?=.*?[0-9])(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[^0-9A-Za-z]).{8,32}$/;
    if (!isStrongPassword.test(password)) {
        const error = new Error('Contraseña debil');
        return res.status(400).json({ msg: error.message });
    }
    next();
};
exports.validPassword = validPassword;
const existEmail = async (req, res, next) => {
    const { email } = req.body;
    const isEmail = await client_1.default.user.findUnique({
        where: {
            email: email
        }
    });
    if (isEmail) {
        const error = new Error('Este email existe. Intente con otro email');
        return res.status(400).json({ msg: error.message });
    }
    next();
};
exports.existEmail = existEmail;
