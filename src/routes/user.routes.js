const { Router } = require("express");
const router = Router();
const userValidators = require("../validators/user-validators");
const Validator = require("../middlewares/validator.middleware");
const userAuth = require("../middlewares/auth-guard");

const usersCtrl = require("../controllers/users.controller");
const userCtrl = require("../controllers/users.controller");
const adminAuth = require("../middlewares/admin-middleware");



/** 
 * @description Para crear una nueva cuenta de usuario
 * @api /api/users/register
 * @access Public
 * @type POST
 */
router.post("/register", userValidators.RegisterValidations, Validator, usersCtrl.createUser);

/** 
 * @description Para verificar una nueva cuenta de usuario via email
 * @api /api/users/verify-now/:verificationCode
 * @access PUBLIC <Only Via email>
 * @type GET
 */
router.get("/verify-now/:verificationCode", usersCtrl.verifyNow);

/**
 * @description Para autenticar a un usuario y obtener un token de autenticación
 * @api /api/users/authenticate
 * @access PUBLIC
 * @type POST
 */
router.post("/authenticate", userValidators.AuthenticateValidations, Validator, userCtrl.authenticate);

/**
 * @description Obtener el perfil de usuario autenticado
 * @api /api/users/api/authenticate
 * @access Private
 * @type GET
 */
router.get("/authenticate", userAuth, userCtrl.authenticated);


/**
 * @description Iniciar el proceso del reseteo de contraseña
 * @api api/users/reset-password/
 * @access Public
 * @type PUT
 */
router.put("/reset-password", userValidators.ResetPassword, Validator, userCtrl.resetPasswordProcess);

/**
 * @description Para llamar a la página de restablecimiento de contraseña
 * @api api/users/reset-password/:passwordResetToken
 * @access Restricted via email
 * @type GET
 */
router.get("/reset-password-now/:resetPasswordToken", userCtrl.resetPasswordGet);

/**
 * @description Para restablecer la contraseña
 * @api api/users/reset-password-now
 * @access Restricted via email
 * @type POST
 */
router.post("/reset-password-now", userCtrl.resetPasswordPost);



//---------------------------------

router.get("/", userValidators.RegisterValidations, usersCtrl.getUsers);

/**
 * @description Para obtener datos de un usuario
 * @api api/users/:_id
 * @access Restricted via userAuth
 * @type GET
 */
router.get("/:id", userValidators.RegisterValidations, userAuth, usersCtrl.getUser);

/**
 * @description Para actualizar datos del usuario (no actualiza contraseña) y empleos publicados
 * @api api/users/:_id
 * @access Restricted via userAuth
 * @type PUT
 */
router.put("/:id", userAuth, userValidators.UserValidations, Validator, usersCtrl.updateUser);

/**
 * @description Para actualizar contraseña de usuario (debe especificar la anterior)
 * @api api/users/:_id
 * @access Restricted via userAuth
 * @type PUT
 */
 router.put("/change-password/:id", userAuth, usersCtrl.updatePasswordUser);

/**
 * @description Para borrar el usuario mediante ID
 * @api api/users/:_id
 * @access Restricted via userAuth
 * @type DELETE
 */
router.delete("/:id", userAuth, userValidators.RegisterValidations, usersCtrl.deleteUser);

/**
 * @description Para borrar una inscripción de empleo por id por un usuario autenticado
 * @api api/jobs/deleteInscibedJob/:id
 * @access Restricted via userAuth
 * @type DELETE
 */
 router.put("/deleteInscribedJob/:id", userAuth, usersCtrl.deleteInscribedJob);


/**
 * @description Para añadir inscripción a un empleo
 * @api api/users/inscribe-job/:_id
 * @access Restricted via userAuth
 * @type PUT
 */
 router.put("/inscribe-job/:id", userAuth, usersCtrl.updateInscribeJob);

 /**
 * @description Para obtener todos los usuarios inscritos por ID de empleo
 * @api api/jobs/allinscribed/:_id
 * @access Restricted via userAuth
 * @type GET
 */
router.get("/allinscribed/:id", userAuth, usersCtrl.getAllInscribed);

//ME HE QUEDADO METIENDO EL ADMIN MIDDLEWARE EN LAS RUTAS NECESITADAS.



module.exports = router;