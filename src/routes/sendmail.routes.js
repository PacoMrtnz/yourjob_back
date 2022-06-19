const Router = require("express");
const userAuth = require("../middlewares/auth-guard");
const sendMailCtrl = require("../controllers/sendmail.controller");
const router = Router();


/**
 * @description Para enviar un email por la sección de contacto
 * @api api/sendmail/
 * @access private
 * @type POST
 */
//  router.post("/", userAuth, sendMailCtrl.sendMail);


module.exports = router;