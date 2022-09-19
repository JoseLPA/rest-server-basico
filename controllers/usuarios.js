const {response} = require('express');
const usuariosGet = (req, res = response) => {
    const {param1, param2='no name', param3} = req.query;
    res.json({
        msg: 'get API - controlador',
        param1,
        param2,
        param3
    });
}

const usuariosPut = (req, res = response) => {
    const {id} = req.params;
    res.json({
        msg: 'put API - controlador',
        id
    });
}

const usuariosPost = (req, res = response) => {
    const {nombre, edad} = req.body;

    res.status(201).json({
        msg: 'post API - controlador',
        nombre,
        edad
    });
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controlador'
    });
}

const usuariosDelete = (req, res = response) => {
    res.json({
        msg: 'delete API - controlador'
    });
}

module.exports = {
    usuariosGet, usuariosPut, usuariosPost, usuariosPatch, usuariosDelete
};