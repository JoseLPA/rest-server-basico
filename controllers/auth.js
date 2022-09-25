/**MODULES */
const { response, json } = require('express');
const bcryptjs = require('bcryptjs');
/**MODELS */
const Usuario = require('../models/usuario');
/**HELPERS */
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');
const { DefaultTransporter } = require('google-auth-library');

const login = async (req, res = response) => {
    const { correo, password } = req.body;
    try {
        //verificar si el correo existe
        const usuario = await Usuario.findOne({ correo });
        if (!usuario) {
            return res.status(400).json({
                msg: 'El usuario o la contrasenia no son correctos. - correo'
            });
        }
        //Verificar si el usuario esta activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'El usuario o la contrasenia no son correctos. - estado:false'
            });
        }
        //Verificar la contrasenia
        const validPass = bcryptjs.compareSync(password, usuario.password);
        if (!validPass) {
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

const googleSingIn = async (req, res = response) => {
    const { id_token } = req.body;
    try {
        const { nombre, img, correo } = await googleVerify(id_token);
        //buscamos el usuario (si es que existe)
        let usuario = await Usuario.findOne({ correo });
        //Si el usuario no existe
        if (!usuario) {
            //se crea el usuario
            const data = {
                nombre,
                correo,
                rol: DefaultTransporter,
                password: ':P',
                img,
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        //Si el usuario esta eliminado
        if (!usuario.estado){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        //Generar JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {
        res.status(400).json({
            msg: 'El token no pudo ser verificado'
        });
    }

}

module.exports = {
    login,
    googleSingIn
};