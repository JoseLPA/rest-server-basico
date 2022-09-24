const Role = require('../models/role');
const Usuario = require('../models/usuario');


const esRolValido = async( role = '') =>{
    const existeRol = await Role.findOne({role});
    if(!existeRol){
        throw new Error(`El rol ${role} no existe en la base de datos`);
    }
}

const emailExiste = async(correo = '')=>{
    //Verificar si el correo existe
    const existeEmail = await Usuario.findOne({correo});
    if (existeEmail){
        throw new Error(`El correo ingresado: ${correo}, ya existe en nuestros registros.`);
    }
}

const existeUsuarioByID = async(id)=>{
    //Verificar si el usuario existe
    const existeUsuario = await Usuario.findById(id);
    if (!existeUsuario){
        throw new Error(`El ID ingresado no existe en la base de datos`);
    }
}

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioByID
}