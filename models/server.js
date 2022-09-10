require("colors");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { dbConnection } = require("../database/config");

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usuariosPath = "/api/usuarios";
        this.authPath = "/api/auth";

        // Connection to DATABASE
        this.connectDB();

        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();
    }

    async connectDB() {
        await dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio Público
        this.app.use(express.static("public"));

        // Morgan Middleware
        this.app.use(morgan("dev"));
    }

    routes() {
        this.app.use(this.authPath, require("../routes/auth.routes"));
        this.app.use(this.usuariosPath, require("../routes/usuarios.routes"));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.clear();
            console.log(
                "Server Running on ".white +
                    "http://localhost:".rainbow +
                    `${this.port}`.rainbow +
                    "\n" +
                    "---------------------------------------"
            );
        });
    }
}

module.exports = Server;
