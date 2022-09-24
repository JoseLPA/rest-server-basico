const {Router} = require('express');
const {body, check} = require('express-validator');

const {usuariosGet, usuariosPut, usuariosPost, usuariosPatch, usuariosDelete} = require('../controllers/usuarios');
const {validarCampos} = require('../middlewares/validar-campos');
const {esRolValido, emailExiste, existeUsuarioByID} = require('../helpers/db-validators');

const router = Router();
const validarInputs = [
    body('nombre', 'El nombre es obligatorio').not().isEmpty(),
    body('password', 'La contrasenia debe tener mas de 6 letras').isLength({min: 6}),
    body('correo', 'El correo ingresado no es valido').isEmail(),
    body('correo').custom(emailExiste),
    //body('role', 'No es un rol permitido').isIn(['ADMIN_ROLE','USER_ROLE']),
    body('role').custom(esRolValido),
    validarCampos
];

const validarPut = [
    check('id', 'El ID ingresado no es uno valido.').isMongoId(),
    check('id').custom(existeUsuarioByID),
    body('role').custom(esRolValido),
    validarCampos
];

const validarDelete = [
    check('id', 'El ID ingresado no es uno valido.').isMongoId(),
    check('id').custom(existeUsuarioByID),
    validarCampos
];

router.get('/', usuariosGet);

router.put('/:id',validarPut, usuariosPut);

router.post('/',validarInputs, usuariosPost);

router.patch('/', usuariosPatch);

router.delete('/:id',validarDelete, usuariosDelete);

module.exports = router;