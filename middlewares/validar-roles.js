const { request, response } = require("express");

const isAdminRole = (req = request, res = response, next) => {
  if (!req.usuario) {
    return res.status(500).json({
      msg: "Se intenta verificar un role sin antes validar el token",
    });
  }

  const { rol, nombre } = req.usuario;
  if (rol !== "ADMIN_ROLE") {
    return res.status(401).json({
      msg: `[${nombre}] no tiene permisos para realizar esta acción`,
    });
  }

  next();
};

const tieneRole = (...roles) => {
  return (req, res, next) => {
    console.log(req.usuario);
    if (!req.usuario) {
      return res.status(500).json({
        msg: "Se intenta verificar un role sin antes validar el token",
      });
    }

    if (!roles.includes(req.usuario.rol)) {
      return res.status(401).json({
        msg: `El servicio requiere uno de los siguientes roles ${roles}`,
      });
    }

    next();
  };
};

module.exports = {
  isAdminRole,
  tieneRole,
};
