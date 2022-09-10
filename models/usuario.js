const { Schema, model } = require("mongoose");

const usuarioSchema = Schema({
    nombre: {
        type: String,
        required: [true, "El usuario es obligatorio"],
    },
    correo: {
        type: String,
        required: [true, "El correo es obligatorio"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"],
    },
    img: {
        type: String,
    },
    rol: {
        type: String,
        required: true,
        emun: ["ADMIN_ROLE", "USER_ROLE"],
    },
    state: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    },
});

/**
 *
 * @returns Un objeto con las propiedades que no quiero enviar al cliente
 */
usuarioSchema.methods.toJSON = function () {
    const { __v, password, ...usuario } = this.toObject();
    return usuario;
};

module.exports = model("Usuario", usuarioSchema);
