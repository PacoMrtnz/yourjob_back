const { Router } = require("express");
const router = Router();

const postsCtrl = require("../controllers/posts.controller");
const userAuth = require("../middlewares/auth-guard");
const postValidations = require("../validators/post-validator");
const validator = require("../middlewares/validator.middleware");
const uploaderImage = require("../middlewares/uploader").uploadPostImage;

/**
 * @description Para subir una imagen para el post
 * @api api/posts/post-image-upload
 * @access private
 * @type POST
 */
router.post("/post-image-upload", userAuth, uploaderImage.single("image"), postsCtrl.updateImage);

/**
 * @description Para crear un nuevo post por un usuario autenticado
 * @api api/posts/create-post
 * @access private
 * @type POST
 */
router.post("/create-post", userAuth, postValidations.title, postValidations.content, validator, postsCtrl.createPost);

/**
 * @description Para actualiza un post por un usuario autenticado
 * @api api/posts/update-post/:id
 * @access private
 * @type PUT
 */
router.put("/update-post/:id", userAuth, postValidations.title, postValidations.content, validator, postsCtrl.updatePost);

/**
 * @description Para dar me gusta un post por un usuario autenticado
 * @api api/posts/like-post/:id
 * @access private
 * @type PUT
 */
router.put("/like-post/:id", userAuth, postsCtrl.likePost);

module.exports = router;