const { request, response } = require("express");
const bcryptjs = require("bcryptjs");
const Usuario = require("../models/usuario");
const { genJWT } = require("../helpers/generate-jwt");

const login = async (req = request, res = response) => {
    const { correo, password } = req.body;
    try {
        // ? Verificamos si el email existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: "El usuario o la contraseña no son correctos - (correo)",
            });
        }
        //? Verificamos si el usuario que intenta hacer login está activo (state: true)
        if (!usuario.state) {
            return res.status(400).json({
                msg: "El usuario no está activo - state => false",
            });
        }
        // ? Verificamos que la contraseña sea con la que se ha registrado.

        const validPassword = bcryptjs.compareSync(password, usuario.password);

        if (!validPassword) {
            return res.status(400).json({
                msg: "El usuario o la contraseña no son correctos - (password)",
            });
        }

        // ? Generar el JWT (JSON Web Token)

        const token = await genJWT(usuario.id);

        res.status(200).json({
            usuario,
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Contacte con el administrador",
        });
    }
};

module.exports = {
    login,
};
