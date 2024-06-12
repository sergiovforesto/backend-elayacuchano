"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delete_profile = exports.get_profile = exports.update_profile = exports.create_profile = void 0;
const client_1 = __importDefault(require("../lib/client"));
const cloudinary_img_1 = __importDefault(require("../cloudinary/cloudinary-img"));
const create_profile = async (req, res) => {
    const { session_user } = req;
    const { bio, country, education } = req.body;
    const file = req.file;
    const user = await client_1.default.user.findUnique({ where: { id: session_user.id } });
    if (!user) {
        const error = new Error('Usuario no existe/Inicie sessión');
        return res.status(200).json({ msg: error.message });
    }
    if ([bio, country, education].includes('')) {
        const error = new Error('Campos vacios');
        return res.status(200).json({ msg: error.message });
    }
    const profile = await client_1.default.profile.findUnique({
        where: { userId: session_user.id }, select: { userId: true }
    });
    if (profile) {
        const error = new Error('Pefil ya creado');
        return res.status(400).json({ msg: error.message });
    }
    try {
        if (file) {
            const result = await cloudinary_img_1.default.uploader.upload(file.path, { folder: 'ayacuchano/profiles' });
            const imageUrl = result.secure_url;
            const my_bio = await client_1.default.profile.create({
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
            });
            res.status(201).json({ ok: true, my_bio });
        }
        else {
            const my_bio = await client_1.default.profile.create({
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
            });
            res.status(201).json({ ok: true, my_bio });
        }
    }
    catch (error) {
        res.status(500).json({ ErrorToCreateProfile: error });
    }
};
exports.create_profile = create_profile;
const update_profile = async (req, res) => {
    const { session_user } = req;
    const { bio, education, country } = req.body;
    const file = req.file;
    const user = await client_1.default.user.findUnique({
        where: { id: session_user.id }, select: { id: true }
    });
    const profile = await client_1.default.profile.findUnique({
        where: { userId: session_user.id }, select: { userId: true, image: true }
    });
    if (!user) {
        const error = new Error('User no existe');
        return res.status(400).json({ msg: error.message });
    }
    if (!profile) {
        const error = new Error('Perfil no existe');
        return res.status(400).json({ msg: error.message });
    }
    if (profile.userId !== user.id) {
        const error = new Error('Solo el usuario del perfil puede hacer esta acción');
        return res.status(400).json({ msg: error.message });
    }
    if ([bio, country, education].includes('')) {
        const error = new Error('Campos vacios');
        return res.status(200).json({ msg: error.message });
    }
    try {
        if (file) {
            if (profile.image) {
                const partes = profile.image.split('/');
                const public_id = partes[partes.length - 1].split('.')[0];
                await cloudinary_img_1.default.uploader.destroy(`ayacuchano/profiles/${public_id}`);
            }
            const result = await cloudinary_img_1.default.uploader.upload(file.path, { folder: 'ayacuchano/profiles' });
            const imageUrl = result.secure_url;
            const new_profile = await client_1.default.profile.update({
                where: { userId: session_user.id },
                data: {
                    bio: bio,
                    education: education,
                    country: country,
                    image: imageUrl ?? null,
                }
            });
            res.status(200).json({ ok: true });
        }
        else {
            const new_profile = await client_1.default.profile.update({
                where: { userId: session_user.id },
                data: {
                    bio: bio,
                    education: education,
                    country: country,
                }
            });
            res.status(200).json({ ok: true });
        }
    }
    catch (error) {
        res.status(500).json({ ErrorToUpdateProfile: error });
    }
};
exports.update_profile = update_profile;
const get_profile = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await client_1.default.user.findUnique({
            where: { id: id },
            select: {
                Profile: true
            },
        });
        if (!user?.Profile || !user) {
            const error = new Error('Usuario / Perfil no existe');
            return res.status(400).json({ msg: error.message });
        }
        res.status(200).json(user);
    }
    catch (error) {
        res.status(500).json({ ErrorToGetProfile: error });
    }
};
exports.get_profile = get_profile;
const delete_profile = async (req, res) => {
    const { session_user } = req;
    const user = await client_1.default.user.findUnique({
        where: { id: session_user.id }, select: { id: true }
    });
    const profile = await client_1.default.profile.findUnique({
        where: { userId: session_user.id }, select: { userId: true }
    });
    if (!user) {
        const error = new Error('Usuario no existe/No autenticado');
        return res.status(400).json({ msg: error.message });
    }
    if (!profile) {
        const error = new Error('Perfil no existe');
        return res.status(400).json({ msg: error.message });
    }
    if (profile.userId !== user.id) {
        const error = new Error('Solo el usuario del perfil puede hacer esta acción');
        return res.status(400).json({ msg: error.message });
    }
    try {
        const delete_profile = await client_1.default.profile.delete({
            where: { userId: session_user.id }
        });
        res.status(200).json({ ok: true });
    }
    catch (error) {
        res.status(500).json({ ErrorToDeleteProfile: error });
    }
};
exports.delete_profile = delete_profile;
