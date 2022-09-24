const {response} = require('express');
/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @descripcion Permite que solo el usuario ADMIN_ROLE sea el que pueda eliminar usuarios de la BD
 * @returns 
 */
const esAdminRole = (req, res = response, next) =>{
    if(!req.usuarioAutenticado){
        return res.status(500).json({
            msg: 'Se esta intentando validar el role sin verificar el token primero'
        });
    }

    const {role, nombre} = req.usuarioAutenticado;

    if(role !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `El usuario ${nombre} no esta autorizado para realizar esta accion`
        });
    }

    next();
}

/**
 * @param  {...any} roles 
 * @descripcion Permite que los usuarios enviados por parametros sean los unicos que puedan eliminar a los usuarios de la BD.
 * @returns 
 */
const tieneRole = (...roles) => {
    return (req, res = response, next)=>{
        if(!req.usuarioAutenticado){
            return res.status(500).json({
                msg: 'Se esta intentando validar el role sin verificar el token primero'
            });
        }

        if(!roles.includes(req.usuarioAutenticado.role)){
            return res.status(401).json({
                msg: `El rol ${req.usuarioAutenticado.role} no esta autorizado para realizar esta accion`
            });
        }
        next();
    }
}

module.exports = {
    esAdminRole,
    tieneRole
}