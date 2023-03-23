

const { Router } = require('express');
const { getUsers, modifyUser, updateUser, deleteUser } = require('../controllers/user.controllers');

const router = Router();

// Rputes
router.get('/', getUsers);

router.put('/:id', modifyUser);

router.post('/', updateUser);

router.delete('/', deleteUser);


module.exports = router;