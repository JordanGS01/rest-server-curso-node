

const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT, isAdminRole, hasRole } = require('../middlewares')

const { roleIsValid, existsEmail, userExistsById } = require('../helpers/db-validators')

const { userGet, userPut, userPost, userDelete } = require('../controllers/user.controllers');


const router = Router();

// Routes
router.get('/', userGet);

router.put('/:id', [
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( userExistsById ),
    check('role').custom( roleIsValid ),
    validarCampos
], userPut);

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe tener más de 6 dígitos').isLength({ min: 6 }),
    check('email', 'El correo brindado no es válido').isEmail(),
    //check('role', 'No es un rol válido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('email').custom( existsEmail ),// Verificamos si el correo existe
    check('role').custom( roleIsValid ),
    validarCampos
], userPost);

router.delete('/:id', [
    validarJWT,
    //isAdminRole,
    hasRole('ADMIN_ROLE', 'USER_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom( userExistsById ),
    validarCampos
], userDelete);


module.exports = router;