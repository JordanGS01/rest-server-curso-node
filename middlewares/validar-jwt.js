

const { response, request } = require('express');

const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');


const validarJWT = async( req = request, res = response, next ) => {
    const token = req.header('Authorization');

    // Validate that the token comes in the request
    if ( !token ) {
        return res.status(400).json({
            msg: 'No hay token en la petición'
        });
    }

    try {
        const { uid } = jwt.verify( token, process.env.SECRETORPUBLICKEY );

        // Read user that corresponds to the given uid
        const user = await Usuario.findById(uid);

        // Verify that the user actually exists
        if ( !user ) {
            return res.status(401).json({
                msg: 'Token no válido - usuario no existe en BD'
            })
        }

        // Verify if the user has not been deleted
        if ( !user.state ) {
            return res.status(401).json({
                msg: 'Token no válido - usuario con estado: "false"'
            })
        }

        req.user = user;
        
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg: 'Token no válido'
        });
    }    
}


module.exports = {
    validarJWT
}