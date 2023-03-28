

const Usuario = require('../models/usuario')
const Role = require('../models/role');


const roleIsValid = async(role = '') => {
    const roleExists = await Role.findOne({ role });
    if ( !roleExists ) {
        throw new Error(`El rol ${role} no está registrado en la base de datos`);
    }
}

const existsEmail = async(email = '') => {
    const emailExists = await Usuario.findOne({ email });
    if ( emailExists ) {
        throw new Error(`El correo '${email}' ya está registrado`);
    }
}

module.exports = {
    roleIsValid,
    existsEmail
}