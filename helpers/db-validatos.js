const Role = require("../models/role");
const Usuario = require("../models/usuario");

// Verificar si el rol existe en la base de datos
const esRoleValido = async (rol = "") => {
      const existeRol = await Role.findOne({ rol });
      if (!existeRol) throw new Error(`[${rol}] no está en la base de datos`);
};

// Verificar si el correo existe
const existEmail = async (correo = "") => {
      const existeEmail = await Usuario.findOne({ correo });
      if (existeEmail) throw new Error(`El correo ${correo} ya está en uso`);
};

const existUserById = async (id) => {
      const existUser = await Usuario.findById(id);
      if (!existUser) throw new Error(`El id ${id} no está en la base de datos`);
};

module.exports = {
      esRoleValido,
      existEmail,
      existUserById,
};
