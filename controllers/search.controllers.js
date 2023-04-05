

const { request, response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { Usuario, Categoria, Producto, Role } = require('../models')

const allowedCollections = [
    'categories',
    'products',
    'roles',
    'users'
]

const searchUsers = async(term = '', res = response) => {
    const isMongoId = ObjectId.isValid( term );

    if ( isMongoId ) {
        const user = await Usuario.findById( term );
        return res.status(200).json({
            results: ( user ) ? [ user ] : []
        });
    }

    const regex = new RegExp( term, 'i' );

    const usuarios = await Usuario.find({ 
        $or: [{ name: regex }, { email: regex }],// Debe cumplir cualqueira de estas dos condiciones
        $and: [{ state: true }] // Y obligatoriamente debe cumpir esta
     });

    return res.json({
        results: usuarios
    });
}

const searchCategories = async(term = '', res = response) => {
    const isMongoId = ObjectId.isValid( term );

    if ( isMongoId ) {
        const categorie = await Categoria.findById( term );
        return res.status(200).json({
            results: ( categorie ) ? [ categorie ] : []
        });
    }

    const regex = new RegExp( term, 'i' );

    const categories = await Categoria.find({ name: regex, state: true });

    return res.json({
        results: categories
    });
}

const searchProducts = async(term = '', res = response) => {
    const isMongoId = ObjectId.isValid( term );

    if ( isMongoId ) {
        const product = await Producto.findById( term )
                            .populate('categorie', 'name');
        return res.status(200).json({
            results: ( product ) ? [ product ] : []
        });
    }

    const regex = new RegExp( term, 'i' );

    const products = await Producto.find({ name: regex, state: true })
                            .populate('categorie', 'name');

    return res.json({
        results: products
    });
}

const searchRoles = async(term = '', res = response) => {
    const isMongoId = ObjectId.isValid( term );

    if ( isMongoId ) {
        const role = await Role.findById( term );
        return res.status(200).json({
            results: ( role ) ? [ role ] : []
        });
    }

    const regex = new RegExp( term, 'i' );

    const usuarios = await Role.find({ role: regex });

    return res.json({
        results: usuarios
    });
}

const search = (req = request, res = response) => {
    const { collection, term } = req.params;

    if ( !allowedCollections.includes( collection ) ) {
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${allowedCollections}`
        })
    }

    switch (collection) {
        case 'categories':
            searchCategories(term, res);
            break;
        case 'products':
            searchProducts(term, res);
            break;
        case 'roles':
            searchRoles(term, res);
            break;
        case 'users':
            searchUsers(term, res);
            break;
        default:
            return res.status(500).json({
                msg: 'Se me olvidó hacer esta búsqueda'
            })
    }
}


module.exports = {
    search
}