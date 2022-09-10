require("colors");
const mongoose = require("mongoose");

const dbConnection = async () => {
    try {
        mongoose.connect(process.env.MONGO_CNN).then((e) =>
            // console.log("Se ha conectado a la base de datos".black.bgWhite)
            console.log(
                "Se ha".white +
                    " CONECTADO".green.bold +
                    " a la ".white +
                    " Base de Datos".white
            )
        );
    } catch (error) {
        console.log(
            "Error al conectar a la base de datos".bold.italic.underline.red
        );
        // throw new Error("Error Joe");
    }
};

module.exports = {
    dbConnection,
};
