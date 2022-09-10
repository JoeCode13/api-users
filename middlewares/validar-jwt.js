const { response, request } = require("express");
const jwt = require("jsonwebtoken");

const Usuario = require("../models/usuario");

const validarJWT = async (req = request, res = response, next) => {
    const token = req.header("x-token");
    if (!token) {
        return res.status(401).json({
            msg: "Unauthorized",
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuario = await Usuario.findById(uid);

        if (!usuario) {
            return res.status(401).json({
                msg: "Token no válido - (no DB user)",
            });
        }

        // Verificar si el usuario está activo (state: true)
        if (!usuario.state) {
            return res.status(401).json({
                msg: "Token no válido - (usuario con state : false)",
            });
        }

        req.usuario = usuario;
        next();
    } catch (error) {
        return res.status(401).json({
            msg: "Token no válido",
        });
    }
};

module.exports = {
    validarJWT,
};
