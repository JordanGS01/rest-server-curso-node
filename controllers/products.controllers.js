

const { response, request } = require('express');
const { Producto } = require('../models');


const getProducts = async(req = request, res = response) => {
    try {
        const { limit = 10, startFrom = 0 } = req.query;

        const query = { state: true };
        // Promise.all nos permite ejecutar ambas promesas simultaneamente, mejorando el rendimiento
        const [ total, products ] = await Promise.all([
            Producto.countDocuments(query),
            Producto.find(query)
                .skip( Number(startFrom) )
                .limit( Number(limit) )
                .populate('user categorie', 'name')
        ]);

        res.status(200).json({
            total,
            products
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Error inesperado al obtener todos los productos registrados"
        });
    }
}

const getProductById = async(req = request, res = response) => {
    try {
        const { id } = req.params;

        const product = await Producto.findById(id).populate('user categorie', 'name');

        res.status(200).json(product);
    } catch (error) {
        console.log(error);

        res.status(500).json({ msg: 'Error inesperado a la hora de obtener el producto' })
    }
}

const createProduct =  async(req = request, res = response) => {
    const { state, user, ...data } = req.body;
    
    data.name = data.name.toUpperCase();

    const productDB = await Producto.findOne({ name: data.name });

    if ( productDB ) {
        return res.status(400).json({
            msg: `El producto ${productDB.name} ya existe en la base de datos`
        });
    }

    // Set the current user
    data.user = req.user._id;


    const product = new Producto( data );
    // Save product on DB
    product.save();

    res.status(201).json(product);
}

const updateProduct = async(req = request, res = response) => {
    try {
        const { id } = req.params;
        const { state, user, categorie, ...data } = req.body;
        
        if ( data.name ) {
            data.name = data.name.toUpperCase();
        }
        data.user = req.user._id;

        //El { new: true } es para que se retorne el objeto nuevo.
        const updatedProduct = await Producto.findByIdAndUpdate(id, data, { new: true });

        res.status(202).json(updatedProduct);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error inesperado al modificar un producto'
        });
    }
}

const deleteProduct = async(req = request, res = response) => {
    const { id } = req.params;

    //El { new: true } es para que se retorne el objeto nuevo.
    const deletedProduct = await Producto.findByIdAndUpdate(id, { state: false }, { new: true });

    res.status(200).json( deletedProduct );
}

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
}