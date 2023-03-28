

const express = require('express');
const cors = require('cors');

const { dbConnection } = require('../database/config')


class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.usersPath = '/api/users';

        //ConectarDB
        this.conectarDB();

        // Middlewares
        this.middlewares();
        // App routes
        this.routes();
    }

    //Database coneection
    async conectarDB() {
        await dbConnection();
    }

    middlewares() {
        // CORS
        this.app.use( cors() );
        // Readding and parse of the body of the request
        this.app.use( express.json() );
        // Public directory
        this.app.use( express.static('public') );
    }

    routes() {
        this.app.use(this.usersPath, require('../routes/user.routes'));
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server is running on port ${this.port}`);
        });
    }
}

module.exports = Server;