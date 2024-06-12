"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_all_users = exports.session_user = exports.new_password = exports.valid_token_change_password = exports.send_email_change_password = exports.logout_user = exports.login_user = exports.confirm_user_by_token = exports.create_user = void 0;
const client_1 = __importDefault(require("../lib/client"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const generateRandomCode_1 = require("../helpers/generateRandomCode");
const generateJWT_1 = require("../helpers/generateJWT");
const emails_1 = require("../helpers/emails");
/*
La interfaz Request en Express con TypeScript puede tomar hasta tres parámetros genéricos: Request<ParamsDictionary, ResBody, ReqBody, Query>. Estos son:

ParamsDictionary: Define los parámetros de ruta o parámetros de consulta.
ResBody: Define el tipo de cuerpo de la respuesta.
ReqBody: Define el tipo de cuerpo de la petición.
Query: Define el tipo de la propiedad query del objeto Request.
Cuando ves Request<{}, {}, User>, los dos primeros {} son para ParamsDictionary y ResBody

segunda forma:  const { name, lastName, email, password } = req.body as User
*/
const create_user = async (req, res) => {
    const { name, lastName, email, password } = req.body;
    try {
        const register_user = await client_1.default.user.create({
            data: {
                name: name,
                lastName: lastName,
                email: email,
                password: bcryptjs_1.default.hashSync(password, 10),
                token: (0, generateRandomCode_1.generateRandomCode)()
            }
        });
        (0, emails_1.sendEmailRegister)({
            email: register_user.email,
            name: register_user.name,
            token: register_user.token || ''
        });
        res.status(201).json({ ok: true });
    }
    catch (error) {
        const err = new Error('Error al crear usuario. Intente de nuevo');
        res.status(500).json({ msg: err.message });
    }
};
exports.create_user = create_user;
const confirm_user_by_token = async (req, res) => {
    const { token } = req.params;
    const isToken = await client_1.default.user.findUnique({
        where: {
            token: token
        },
        select: {
            id: true,
            token: true,
            isAuth: true,
        }
    });
    if (!isToken) {
        const error = new Error('Token no disponible');
        return res.status(404).json({ msg: error.message });
    }
    try {
        const confirmToken = await client_1.default.user.update({
            where: {
                id: isToken.id
            },
            data: {
                token: null,
                isAuth: true,
                isActive: true
            }
        });
        res.status(200).json({ ok: true });
    }
    catch (error) {
        res.status(500).json({ ErrorToConfim: error });
    }
};
exports.confirm_user_by_token = confirm_user_by_token;
const login_user = async (req, res) => {
    const { email, password } = req.body;
    const user = await client_1.default.user.findUnique({
        where: { email: email },
        select: {
            id: true,
            email: true,
            password: true,
            isAuth: true,
            inSession: true,
            token: true,
        }
    });
    if (!user) {
        const error = new Error('Usuario no existe');
        return res.status(400).json({ msg: error.message });
    }
    if (!user.isAuth) {
        const error = new Error('Usuario no autenticado');
        return res.status(400).json({ msg: error.message });
    }
    const validPassword = bcryptjs_1.default.compareSync(password, user.password);
    if (!validPassword) {
        const error = new Error('Contraseña no valida');
        return res.status(400).json({ msg: error.message });
    }
    await client_1.default.user.update({
        where: { email: email },
        data: {
            inSession: true
        }
    });
    const { password: userPassword, isAuth, email: userEmail, ...res_user } = user;
    res_user.token = (0, generateJWT_1.generateJWT)(user.id);
    res.status(200).json({ ok: true, user: res_user });
};
exports.login_user = login_user;
const logout_user = async (req, res) => {
    const { session_user } = req;
    const { email } = req.body;
    const user = await client_1.default.user.findUnique({
        where: { id: session_user.id },
        select: {
            inSession: true
        }
    });
    if (!user?.inSession) {
        const error = new Error('Usuario no esta en sesión');
        return res.status(400).json({ msg: error.message });
    }
    await client_1.default.user.update({
        where: { email: email },
        data: {
            inSession: false
        }
    });
    res.status(200).json({ ok: true });
};
exports.logout_user = logout_user;
const send_email_change_password = async (req, res) => {
    const { email } = req.body;
    const user = await client_1.default.user.findUnique({
        where: { email: email },
        select: {
            email: true,
            isAuth: true,
            token: true
        }
    });
    if (!user) {
        const error = new Error('Email no existe');
        return res.status(400).json({ msg: error.message });
    }
    if (!user.isAuth) {
        const error = new Error('Usuario no autenticado');
        return res.status(400).json({ msg: error.message });
    }
    try {
        const sendToken = await client_1.default.user.update({
            where: { email: email },
            data: {
                token: (0, generateRandomCode_1.generateRandomCode)()
            }
        });
        (0, emails_1.sendEmailForgotPassword)({
            email: sendToken.email,
            name: sendToken.name,
            token: sendToken.token || ''
        });
        res.status(200).json({ ok: true });
    }
    catch (error) {
        res.status(500).json({ errorTochangePassword: error });
    }
};
exports.send_email_change_password = send_email_change_password;
const valid_token_change_password = async (req, res) => {
    const { token } = req.params;
    const user = await client_1.default.user.findUnique({
        where: { token: token },
        select: { token: true }
    });
    if (!user || user.token === null) {
        const error = new Error('Token no encontrado');
        return res.status(400).json({ msg: error.message });
    }
    try {
        if (user)
            res.status(200).json({ ok: true });
    }
    catch (error) {
        res.status(500).json({ ErrorToValidToken: error });
    }
};
exports.valid_token_change_password = valid_token_change_password;
const new_password = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    const user = await client_1.default.user.findUnique({
        where: { token: token },
        select: {
            token: true,
            password: true,
            email: true
        }
    });
    if (!user?.token || user?.token === null) {
        const error = new Error('Token no existe');
        return res.status(400).json({ msg: error.message });
    }
    const newPassword = password;
    try {
        const user_password = await client_1.default.user.update({
            where: { email: user.email },
            select: {
                token: true,
                password: true
            },
            data: {
                token: null,
                password: bcryptjs_1.default.hashSync(newPassword)
            }
        });
        res.status(200).json({ ok: true });
    }
    catch (error) {
        res.status(500).json({ ErrorToCreateNewPassword: error });
    }
};
exports.new_password = new_password;
const session_user = async (req, res) => {
    const { session_user } = req;
    try {
        if (session_user.id || session_user) {
            res.json(session_user);
        }
    }
    catch (error) {
        res.status(500).json({ ErrorToGetSession: error });
    }
};
exports.session_user = session_user;
const get_all_users = async (req, res) => {
    const { session_user } = req;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 6;
    const admin = await client_1.default.user.findUnique({
        where: { id: session_user.id }
    });
    if (admin?.role !== 'admin') {
        const error = new Error('No es Administrador');
        return res.status(400).json({ msg: error.message });
    }
    try {
        const users = await client_1.default.user.findMany({
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
        });
        const totalUsers = await client_1.default.user.count();
        res.status(200).json({ ok: 'ok', totalUsers, users });
    }
    catch (error) {
        return res.status(500).json(error);
    }
};
exports.get_all_users = get_all_users;
