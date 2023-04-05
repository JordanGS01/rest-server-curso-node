

const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, isAdminRole } = require('../middlewares');
const { categorieExists, productExists } = require('../helpers/db-validators')

const { createProduct, getProducts, getProductById,
        updateProduct, deleteProduct } = require('../controllers/products.controllers');


const router = Router();

// Routes
// Get all categories - public
router.get('/', getProducts);

// Get categorie by id - public
router.get('/:id', [
    check('id', 'No es un id de MongoDB válido').isMongoId(),
    check('id').custom( productExists ),
    validarCampos
], getProductById);

// Post new categorie - private - every person with valid token
router.post('/', [
    validarJWT,
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('categorie', 'El id de la categoría es obligatorio').not().isEmpty(),
    check('categorie', 'No es un id de MongoDB').isMongoId(),
    check('categorie').custom( categorieExists ),
    validarCampos
], createProduct);

// Put update categorie by id  - private - every person with valid token
router.put('/:id', [
    validarJWT,
    check('categorie', 'No es un id de MongoDB').isMongoId(),
    check('id').custom( productExists ),
    validarCampos
], updateProduct);

// Delete categorie by id  - Admin
router.delete('/:id', [
    validarJWT,
    isAdminRole,
    check('id', 'No es un id de MongoDB válido').isMongoId(),
    check('id').custom( productExists ),
    validarCampos
], deleteProduct);


module.exports = router;