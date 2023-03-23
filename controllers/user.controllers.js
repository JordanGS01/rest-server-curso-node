

const { response } = require('express');

const getUsers = (req, res = response) => {
    const params = req.query;

    res.json({
        msg: 'GET API - Controller',
        ...params
    });
};

const modifyUser = (req, res = response) => {
    const { id } = req.params;
    
    res.json({
        msg: 'PUT API - Controller',
        id
    });
};

const updateUser = (req, res = response) => {
    const body = req.body;
    res.status(201).json({
        msg: 'POST API - Controller',
        ...body
    });
}

const deleteUser = (req, res = response) => {
    res.json({
        msg: 'DELTE API - Controller'
    });
}

module.exports = {
    getUsers,
    modifyUser,
    updateUser,
    deleteUser
}