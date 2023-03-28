

const { response, request } = require('express');
const bcrypyjs = require('bcryptjs');

const Usuario = require('../models/usuario');


const userGet = (req = request, res = response) => {
    const params = req.query;

    res.json({
        msg: 'GET API - Controller',
        ...params
    });
};

const userPut = (req = request, res = response) => {
    const { id } = req.params;
    
    res.json({
        msg: 'PUT API - Controller',
        id
    });
};

const userPost = async(req = request, res = response) => {
    const { name, email, password, role } = req.body;
    const usuario = new Usuario({ name, email, password, role });

    // Verificar si el correo existe
    // const emailExists = await Usuario.findOne({ email });
    // if ( emailExists ) {
    //     return res.status(400).json({
    //         msg: 'El correo provisto ya está registrado'
    //     });
    // }

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

const userDelete = (req = request, res = response) => {
    res.json({
        msg: 'DELTE API - Controller'
    });
}

module.exports = {
    userGet,
    userPut,
    userPost,
    userDelete
}