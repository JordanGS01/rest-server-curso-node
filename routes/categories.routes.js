

const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, isAdminRole } = require('../middlewares');
const { categorieExists } = require('../helpers/db-validators')

const { createCategorie, deleteCategories, getCategorieById,
        getCategories, updateCategorie } = require('../controllers/categories.controllers');


const router = Router();

// Routes
// Get all categories - public
router.get('/', getCategories);

// Get categorie by id - public
router.get('/:id', [
    check('id', 'No es un id de MongoDB válido').isMongoId(),
    check('id').custom( categorieExists ),
    validarCampos
], getCategorieById);

// Post new categorie - private - every person with valid token
router.post('/', [
    validarJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], createCategorie);

// Put update categorie by id  - private - every person with valid token
router.put('/:id', [
    validarJWT,
    check('name','El nombre es obligatorio').not().isEmpty(),
    check('id').custom( categorieExists ),
    validarCampos
], updateCategorie);

// Delete categorie by id  - Admin
router.delete('/:id', [
    validarJWT,
    isAdminRole,
    check('id', 'No es un id de MongoDB válido').isMongoId(),
    check('id').custom( categorieExists ),
    validarCampos
], deleteCategories);


module.exports = router;