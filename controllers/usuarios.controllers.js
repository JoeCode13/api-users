const { response, request } = require("express");
const bcrypt = require("bcryptjs");
const Usuario = require("../models/usuario");

const usuariosGet = async (req = request, res = response) => {
    const { limite = 5, desde = 0 } = req.query;
    const condition = { state: true };
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(condition),
        Usuario.find(condition).skip(Number(desde)).limit(Number(limite)),
    ]);
    res.json({
        total,
        usuarios,
    });
};

const usuariosPost = async (req, res = response) => {
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario({ nombre, correo, password, rol });

    // todo: Encriptar pass
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    // Guardar usuario y devolver respuesta.
    await usuario.save();
    res.json({
        usuario,
    });
};

const usuariosPut = async (req, res = response) => {
    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;
    if (password) {
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);
    res.json({
        ok: true,
        usuario,
    });
};

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: "patch API - usuariosPatch",
    });
};

const usuariosDelete = async (req = request, res = response) => {
    const { id } = req.params;
    const usuario = await Usuario.findByIdAndUpdate(id, { state: false });

    const userAuthenticated = req.usuario;
    res.status(200).json({ usuario, userAuthenticated });
};

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
};
