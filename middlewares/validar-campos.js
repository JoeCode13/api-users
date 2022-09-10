const { validationResult } = require("express-validator");

const validarCampos = (req, res, next) => {
    const errors = validationResult(req);
    // En caso de que haya error en el Middleware de express-validator
    if (!errors.isEmpty()) {
        return res.status(400).json({ ...errors, on: __filename });
    }

    next();
};

module.exports = {
    validarCampos,
};
