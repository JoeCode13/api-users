const { Router } = require("express");
const { check } = require("express-validator");

const { esRoleValido, existEmail, existUserById } = require("../helpers/db-validatos");
const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");
const { usuariosGet, usuariosPut, usuariosPost, usuariosDelete, usuariosPatch } = require("../controllers/usuarios.controllers");
const { isAdminRole } = require("../middlewares/validar-roles");

const router = Router();

router.get("/", usuariosGet);
router.put(
    "/:id",
    [
        check("id", "no es un ID válido").isMongoId(),
        check("id").custom(existUserById),
        check("rol").custom(esRoleValido),
        validarCampos,
    ],
    usuariosPut
);

router.post(
    "/",
    // Middlewares
    [
        check("nombre", "El nombre es obligatorio").notEmpty(),
        check("password", "La contraseña debe de tener más de 2 letras").isLength({
            min: 2,
        }),
        check("correo", "El correo no es válido").isEmail(),
        check("correo").custom(existEmail),
        check("rol").custom(esRoleValido),
        validarCampos,
    ],
    usuariosPost
);

router.delete(
    "/:id",
    [validarJWT, isAdminRole, check("id", "no es un ID válido").isMongoId(), check("id").custom(existUserById), validarCampos],
    usuariosDelete
);

router.patch("/", usuariosPatch);

module.exports = router;
