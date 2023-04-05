

const { response, request } = require('express');
const { Categoria } = require('../models');


const getCategories = async(req = request, res = response) => {
    try {
        const { limit = 10, startFrom = 0 } = req.query;

        const query = { state: true };
        // Promise.all nos permite ejecutar ambas promesas simultaneamente, mejorando el rendimiento
        const [ total, categories ] = await Promise.all([
            Categoria.countDocuments(query),
            Categoria.find(query)
                .skip( Number(startFrom) )
                .limit( Number(limit) )
                .populate('user', 'name')
        ]);

        res.status(200).json({
            total,
            categories
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "Error inesperado al obtener todas las categorías registradas"
        });
    }
}

const getCategorieById = async(req = request, res = response) => {
    try {
        const { id } = req.params;

        const categorie = await Categoria.findById(id).populate('user', 'name');

        res.status(200).json(categorie);
    } catch (error) {
        console.log(error);

        res.status(500).json({ msg: 'Error inesperado a la hora de obtener la categoría' })
    }
}

const createCategorie =  async(req = request, res = response) => {
    const name = req.body.name.toUpperCase();

    const categorieDB = await Categoria.findOne({ name });

    if ( categorieDB ) {
        return res.status(400).json({
            msg: `La categoría ${categorieDB.name} ya existe en la base de datos`
        });
    }

    // Generate data to save
    const data = {
        name,
        user: req.user._id
    }

    const categorie = new Categoria( data );
    // Save categorie on DB
    categorie.save();

    res.status(201).json(categorie);
}

const updateCategorie = async(req = request, res = response) => {
    try {
        const { id } = req.params;
        const { state, user, ...data } = req.body;
        
        data.name = data.name.toUpperCase();
        data.user = req.user._id;

        //El { new: true } es para que se retorne el objeto nuevo.
        const updatedCategorie = await Categoria.findByIdAndUpdate(id, data, { new: true });

        res.status(202).json(updatedCategorie);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error inesperado al modificar una categoría'
        });
    }
}

const deleteCategories = async(req = request, res = response) => {
    const { id } = req.params;

    //El { new: true } es para que se retorne el objeto nuevo.
    const deletedCategorie = await Categoria.findByIdAndUpdate(id, { state: false }, { new: true });

    res.status(200).json(deletedCategorie);
}

module.exports = {
    createCategorie,
    getCategories,
    getCategorieById,
    updateCategorie,
    deleteCategories
}