

const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generateJWT } = require('../helpers/generate-jwt')


const login = async(req = request, res = response) => {
    const { email, password } = req.body;

    try {
        // Verify if email exists
        const user = await Usuario.findOne({ email });
        if ( !user ) {
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos - correo'
            })
        }

        // Verify if user still active in the DB
        if ( !user.state ) {
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos - state: false'
            })
        }

        // Verify password
        const validPassword = bcryptjs.compareSync( password, user.password );
        if ( !validPassword ) {
            return res.status(400).json({
                msg: 'Usuario / Contraseña no son correctos - password'
            })
        }

        // Generate JWT
        const token = await generateJWT(user.id);
     
        return res.json({
            user,
            token
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'Sucedió un error, comuníqueselo al administrador'
        })
    }
}


module.exports = {
    login
}