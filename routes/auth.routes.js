

const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { login, googleSignIn } = require('../controllers/auth.controllers');


const router = Router();

// Routes
router.post('/login', [
    check('email', 'El correo es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login);


router.post('/google', [
    check('id_token', 'El id_token de Google es necesario').not().isEmpty(),
    validarCampos
], googleSignIn);


module.exports = router;