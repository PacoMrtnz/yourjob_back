const Router = require("express");
const userAuth = require("../middlewares/auth-guard");
const uploaderPostImage = require("../middlewares/uploader").uploadPostImage;
const uploaderCurriculum = require("../middlewares/uploader").uploadCurriculum;
const profileCtrl = require("../controllers/profiles.controller");
const adminAuth = require("../middlewares/admin-middleware");
const router = Router();

// /**
//  * @description Para subir un curriculum al perfil de usuario
//  * @api api/posts/post-image-upload
//  * @access private
//  * @type POST
//  */
 router.post("/curriculum-upload", userAuth, uploaderCurriculum.single("curriculum"), profileCtrl.uploadCurriculum);

// /**
//  * @description Para subir o actualizar un avatar al perfil de usuario
//  * @api api/posts/post-image-upload
//  * @access private
//  * @type POST
//  */
router.post("/avatar-upload", userAuth, uploaderPostImage.single("avatar"), profileCtrl.uploadAvatar);

/**
 * @description Para crear perfil de usuario autenticado
 * @type POST <multipart-form> request
 * @api api/profiles/create-profile
 * @access private
 */
router.post("/create-profile", userAuth, uploaderPostImage.single("avatar"), profileCtrl.createProfile);

/**
 * @description Para obtener un perfil de usuario autenticado
 * @type GET <multipart-form> request
 * @api api/profiles/my-profile
 * @access private
 */
router.get("/my-profile", userAuth, profileCtrl.myProfile);

/**
 * @description Para actualizar un perfil de usuario autenticado
 * @type PUT <multipart-form> request
 * @api api/profiles/update-profile
 * @access private
 */
router.put("/update-profile", userAuth, uploaderPostImage.single("avatar"), profileCtrl.updateProfile);

/**
 * @description Para obtener un perfil de usuario mediante su nombre de usuario  
 * @api api/profiles/update-profile
 * @access public
 * @type GET
 */
router.get("/profile-user/:username", userAuth, profileCtrl.getUsername);

/**
 * @description Para borrar el perfil de usuario mediante su ID
 * @api api/profiles/:_id
 * @access Restricted via userAuth
 * @type DELETE
 */
 router.delete("/:id", userAuth, profileCtrl.deleteProfile);


module.exports = router;