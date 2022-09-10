const { request, response } = require("express");

const isAdminRole = (req = request, res = response, next) => {
    if (!req.usuario) {
        return res.status(500).json({
            msg: "Se intenta verificar un role sin antes validar el token",
        });
    }

    const { rol, nombre } = req.usuario;
    console.log(rol);
    if (rol !== "ADMIN_ROLE") {
        return res.status(401).json({
            msg: `[${nombre}] no tiene permisos para realizar esta acción`,
        });
    }
    next();
};

module.exports = {
    isAdminRole,
};
