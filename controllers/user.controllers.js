

const { response, request } = require('express');
const bcrypyjs = require('bcryptjs');

const Usuario = require('../models/usuario');


const userGet = async(req = request, res = response) => {
    const { limit = 5, startFrom = 0 } = req.query
    const query = { state: true };

    // Promise.all nos permite ejecutar ambas promesas simultaneamente, mejorando el rendimiento
    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip( Number(startFrom) )
            .limit( Number(limit) )
    ]);

    res.json({
        total,
        usuarios
    });
};

const userPut = async(req = request, res = response) => {
    const { id } = req.params;
    const { _id, password, google, correo, ...rest } = req.body;

    //TODO: validar contra BD
    if ( password ) {
        const salt = bcrypyjs.genSaltSync(10);
        rest.password = bcrypyjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, rest);
    
    res.json(usuario);
};

const userPost = async(req = request, res = response) => {
    const { name, email, password, role } = req.body;
    const usuario = new Usuario({ name, email, password, role });

    // Hacer el hash de la contraseña
    const salt = bcrypyjs.genSaltSync(10);
    usuario.password = bcrypyjs.hashSync(password, salt);

    // Guardar en la BD
    await usuario.save();
    
    res.status(201).json({
        msg: 'POST API - Controller',
        usuario
    });
}

const userDelete = async(req = request, res = response) => {
    const { id } = req.params;

    // Lo eliminamos de manera lógica
    const usuario = await Usuario.findByIdAndUpdate( id, {state: false} );

    res.json({ usuario });
}

module.exports = {
    userGet,
    userPut,
    userPost,
    userDelete
}