const Router = require("express");
const userAuth = require("../middlewares/auth-guard");
const inscriptionCtrl = require("../controllers/inscription.controller");
// const validator = require("../middlewares/validator.middleware");
// const userAuth = require("../middlewares/auth-guard");
const validator = require("../middlewares/validator.middleware");
const router = Router();

/**
 * @description Para inscribirse a un empleo por un usuario autenticado
 * @api api/inscription/create-inscription/:id
 * @access private
 * @type POST
 */
router.post("/create-inscription/:id", userAuth, inscriptionCtrl.createInscription);

/**
 * @description Obtiene las inscripciones a los empleos que estén registradas con la id del usuario autenticado
 * @api api/inscription/
 * @access private
 * @type GET
 */
router.get("/public", userAuth, inscriptionCtrl.getInscriptions);

/**
 * @description Para obtener todos una inscripción al empleo por ID con un usuario autenticado
 * @api api/inscription/:id
 * @access private
 * @type GET
 */
router.get("/public/:id", userAuth, inscriptionCtrl.getInscription);

/**
* @description Para eliminar una inscripción a un empleo por id con un usuario autenticado
* @api api/inscription/delete/:id
* @access private
* @type DELETE
*/
router.delete("/public/delete/:id", userAuth, inscriptionCtrl.deleteInscription);

/**
 * @description ADMIN Obtiene todas las inscripciones a los empleos
 * @api api/inscription/
 * @access private
 * @type GET
 */
 router.get("/adm", userAuth, inscriptionCtrl.getInscriptionsAdm);

 /**
  * @description ADMIN Para obtener todos una inscripción al empleo por ID con un usuario autenticado
  * @api api/inscription/:id
  * @access private
  * @type GET
  */
 router.get("/adm/:id", userAuth, inscriptionCtrl.getInscriptionAdm);


/**
* @description ADMIN Para eliminar una inscripción a un empleo por id con un usuario autenticado
* @api api/inscription/delete/:id
* @access private
* @type DELETE
*/
router.delete("/adm/delete/:id", userAuth, inscriptionCtrl.deleteInscriptionAdm);


module.exports = router;