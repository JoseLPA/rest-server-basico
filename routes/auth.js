const {Router} = require('express');
const {body, check} = require('express-validator');

const { login, googleSingIn } = require('../controllers/auth');
const {validarCampos} = require('../middlewares/validar-campos');
const {emailExiste} = require('../helpers/db-validators');



const router = Router();

const validarInputs = [
    body('password', 'La contrasenia es obligatoria').not().isEmpty(),
    body('correo', 'El correo ingresado no es valido').isEmail(),
    validarCampos
];

const validarGoogle = [
    body('id_token', 'id_token es necesario').not().isEmpty(),
    validarCampos
];

router.post('/login', validarInputs, login);
router.post('/google', validarGoogle, googleSingIn);


module.exports = router;