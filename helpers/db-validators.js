

const { Usuario, Role, Categoria, Producto } = require('../models')


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

const userExistsById = async( id ) => {
    const userExists = await Usuario.findById(id);
    if ( !userExists ) {
        throw new Error(`El ID '${id} no existe'`);
    }
}

const categorieExists = async( id ) => {
    const categorieExists = await Categoria.findById(id);
    if ( !categorieExists || !categorieExists?.state ) {
        throw new Error(`La categoria '${id} no existe en la base de datos'`);
    }
}

const productExists = async( id ) => {
    const productExists = await Producto.findById(id);
    if ( !productExists || !productExists?.state ) {
        throw new Error(`El producto con id '${id}' no existe en la base de datos`);
    }
}


module.exports = {
    roleIsValid,
    existsEmail,
    userExistsById,
    categorieExists,
    productExists
}