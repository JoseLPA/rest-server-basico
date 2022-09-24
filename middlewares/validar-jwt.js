const {response} = require('express');
const jwt = require ('jsonwebtoken');

const Usuario = require('../models/usuario');

const validarJWT = async(req, res = response, next) =>{
    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg: 'No existe el token en la peticion'
        });
    }

    try {
        const {uid} = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        //Leer usuario que corresponde el uid
        const usuarioAutenticado = await Usuario.findById(uid);
        //Si el usuario no existe
        if(!usuarioAutenticado){
            return res.status(401).json({
                msg: 'El usuario autenticado no existe'
            });
        }
        //Verificar si el usuario no es un usuario eliminado
        if(!usuarioAutenticado.estado){
            return res.status(401).json({
                msg: 'Token no valido - estado'
            });
        }

        req.usuarioAutenticado = usuarioAutenticado;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'token no valido'
        });
    }
}

module.exports = {
    validarJWT
}