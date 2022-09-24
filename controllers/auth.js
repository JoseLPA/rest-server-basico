const {response} =  require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async(req, res = response) =>{
    const {correo, password} = req.body;
    try {
        //verificar si el correo existe
        const usuario = await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg: 'El usuario o la contrasenia no son correctos. - correo'
            });
        }
        //Verificar si el usuario esta activo
        if(!usuario.estado){
            return res.status(400).json({
                msg: 'El usuario o la contrasenia no son correctos. - estado:false'
            });
        }
        //Verificar la contrasenia
        const validPass = bcryptjs.compareSync( password, usuario.password );
        if(!validPass){
            return res.status(400).json({
                msg: 'El usuario o la contrasenia no son correctos. - pass'
            });
        }
        //Generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Error al conectarse. Hable con el administrador.'
        })
    }
};

module.exports = {
    login
};