const {response} = require('express');
const bcryptjs = require('bcryptjs');
const Usuario = require('../models/usuario');

const usuariosGet = async(req, res = response) => {
    const {limite = 5, desde = 0} = req.query;
    /**
     * Obtenemos los usuarios de la base de datos
     * find: busca todos los usuarios de la base de datos (que estado sea true es para que solo regrese los que no estan "borrados")
     * skip: Permite empezar desde un punto que indique el usuario (se obtiene de los parametros de la url)
     * limit: Permite establecer un limite de usuarios que se quiere extraer de la base de datos
     * 
     * const usuarios = await Usuario.find({estado: true}).skip(Number(desde)).limit(Number(limite));
     * 
     * Para obtener el total de registros de la base de datos usamos el countDocuments
     * 
     * const total = await Usuario.countDocuments({estado: true});
     */

    //El codigo anterior fue remplasado por un arreglo de promesas que permite hacer todo de manera simultanea 
    //(Esto se puede hacer debido a que buscar los usuarios no depende de buscar el total y viceversa)
    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments({estado: true}),
        Usuario.find({estado: true})
        .skip(Number(desde))
        .limit(Number(limite))
    ]);
    //Retornamos
    res.json({
        total,
        usuarios
    });
}

const usuariosPut = async(req, res = response) => {
    const {id} = req.params;
    const {_id,password, google, correo, ...resto} = req.body;

    //Validar
    if(password){
        //Encriptar la contrasenia
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario);
}

const usuariosPost = async (req, res = response) => {
  
    const {nombre, correo, password, role} = req.body;
    const usuario = new Usuario({nombre, correo, password, role});

    
    //Encriptar la contrasenia
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);
    //Guardar en DB
    await usuario.save();
    res.status(201).json({
        usuario
    });
}

const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controlador'
    });
}

const usuariosDelete = async(req, res = response) => {
    const {id} = req.params;
    /**
     * Borrando fisicamente el usuario (no recomendado)
     * const usuario = await Usuario.findByIdAndDelete(id);
     */

    const usuario = await Usuario.findByIdAndUpdate(id, {estado: false});
    res.json(usuario);
}

module.exports = {
    usuariosGet, usuariosPut, usuariosPost, usuariosPatch, usuariosDelete
};