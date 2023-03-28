

const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos')
const { roleIsValid, existsEmail } = require('../helpers/db-validators')

const { userGet, userPut, userPost, userDelete } = require('../controllers/user.controllers');


const router = Router();

// Rputes
router.get('/', userGet);

router.put('/:id', userPut);

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe tener más de 6 dígitos').isLength({ min: 6 }),
    check('email', 'El correo brindado no es válido').isEmail(),
    //check('role', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('email').custom( existsEmail ),
    check('role').custom( roleIsValid ),
    validarCampos
], userPost);

router.delete('/', userDelete);


module.exports = router;