

const { response, request, json } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generateJWT } = require('../helpers/generate-jwt');
const { googleVerify } = require('../helpers/google-verify');



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

const googleSignIn = async(req = request, res = response) => {
    const { id_token } = req.body;

    try {
        const { name, picture, email } = await googleVerify(id_token);

        let user = await Usuario.findOne({ email });

        if( !user ) {
            // Create the user
            const data = {
                name,
                email,
                password: 'google',
                img: picture,
                role: 'USER_ROLE',
                google: true
            };

            user = new Usuario( data );
            await user.save();
        }

        // If the user is in the DB but is disabled
        if ( !user.state ) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generate JSW
        const token = await generateJWT(user.id);

        res.json({
            user,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'El Token no se pudo verificar'
        })
    }

}


module.exports = {
    login,
    googleSignIn
}