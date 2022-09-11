const { request, response, json } = require("express");
const bcryptjs = require("bcryptjs");
const Usuario = require("../models/usuario");
const { genJWT } = require("../helpers/generate-jwt");
const { googleVerify } = require("../helpers/google-verify");

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

const googleSignIn = async (req, res = response) => {
  const { id_token } = req.body;

  try {
    const { nombre, img, correo } = await googleVerify(id_token);

    let usuario = await Usuario.findOne({ correo });

    if (!usuario) {
      // TENGO QUE CREARLO

      const data = {
        nombre,
        correo,
        password: ":P",
        img,
        google: true,
      };

      usuario = new Usuario(data);
      await usuario.save();
    }

    // Si el usuario no está bloqueado

    if (!usuario.state) {
      return res.status(401).json({
        msg: "Usuario bloqueado, hable con el administrador.",
      });
    }

    // ? Generar el JWT (JSON Web Token)
    const token = await genJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    res.status(400).json({
      ok: false,
      msg: "El token no se pudo verificar",
    });
  }
};

module.exports = {
  login,
  googleSignIn,
};
