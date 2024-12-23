const jwt = require("jsonwebtoken");

const genJWT = (uid = "") => {
    return new Promise((resolve, reject) => {
        const payload = { uid };
        jwt.sign(
            payload,
            process.env.SECRETORPRIVATEKEY,
            {
                expiresIn: "4h",
            },
            (error, token) => {
                if (error) {
                    console.log(error);
                    reject("No se ha podido generar el TOKEN");
                } else {
                    resolve(token);
                }
            }
        );
    });
};

module.exports = {
    genJWT,
};
