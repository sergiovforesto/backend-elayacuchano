"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = __importDefault(require("../lib/client"));
const AuthenticationMiddleware = async (req, res, next) => {
    const requestHeaders = req.headers.authorization;
    if (!requestHeaders || !requestHeaders.startsWith('Bearer')) {
        const error = new Error('Autorización no valida');
        return res.status(404).json({ msg: error.message });
    }
    const token = requestHeaders.split(' ')[1];
    const verifiedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    try {
        const session = await client_1.default.user.findUnique({
            where: { id: verifiedToken.id },
            select: { id: true, name: true, lastName: true, email: true, role: true }
        });
        if (!session) {
            const error = new Error('JWT Invalido');
            return res.status(400).json({ msg: error.message });
        }
        //new property to request
        req.session_user = session;
        next();
    }
    catch (error) {
        res.status(500).json({ AuthorizationError: error });
    }
};
exports.AuthenticationMiddleware = AuthenticationMiddleware;
