const Router = require("express");
const userAuth = require("../middlewares/auth-guard");
const jobsCtrl = require("../controllers/jobs.controller");
const jobValidations = require("../validators/job-validators");
const validator = require("../middlewares/validator.middleware");
const adminAuth = require("../middlewares/admin-middleware");
const router = Router();

/**
 * @description Para crear un nuevo empleo por un usuario autenticado
 * @api api/jobs/create-job
 * @access private
 * @type POST
 */
//  router.post("/create-job", userAuth, jobValidations.title, jobValidations.description, validator, jobsCtrl.createJob);
router.post("/create-job", userAuth, jobValidations.title, jobValidations.description, validator, jobsCtrl.createJob);

/**
 * @description Para obtener todos los empleos por un usuario autenticado
 * @api api/jobs/
 * @access public
 * @type GET
 */
router.get("/", userAuth, jobsCtrl.getJobs);

/**
 * @description Para obtener todos los empleos de un username por un usuario autenticado
 * @api api/jobs/
 * @access public
 * @type GET
 */
 router.get("/jobsByUsername/:username", userAuth, jobsCtrl.getJobsByUsername);

/**
 * @description Para obtener un empleo por id por un usuario autenticado
 * @api api/jobs/:id
 * @access public
 * @type GET
 */
router.get("/:id", userAuth, jobsCtrl.getJob);

/**
 * @description Para borrar un empleo por id por un usuario autenticado
 * @api api/jobs/delete/:id
 * @access private
 * @type DELETE
 */
router.put("/delete/:id", userAuth, jobsCtrl.deleteJob);

/**
 * @description Para modificar un empleo por id por un usuario autenticado
 * @api api/jobs/:id
 * @access private
 * @type PUT
 */
router.put("/:id", userAuth, jobValidations.title, jobValidations.description, validator, jobsCtrl.updateJob);



module.exports = router;

