const {Router} = require('express');
const {body, check} = require('express-validator');

const { login } = require('../controllers/auth');
const {validarCampos} = require('../middlewares/validar-campos');
const {emailExiste} = require('../helpers/db-validators');



const router = Router();

const validarInputs = [
    body('password', 'La contrasenia es obligatoria').not().isEmpty(),
    body('correo', 'El correo ingresado no es valido').isEmail(),
    validarCampos
];

router.post('/login', validarInputs, login);

module.exports = router;