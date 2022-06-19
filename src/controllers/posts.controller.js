const postCtrl = {};
// const User = require("../models/user");
const Post = require("../models/Post");
const constants = require("../constants/index");
const SlugGenerator = require("../functions/slug-generator");


// Subida de imagen para el post
postCtrl.updateImage = async (req, res) => {
    try {
        let { file } = req;
        // console.log("FILE", file);
        let filename = constants.DOMAIN + "post-images/" + file.filename;
        return res.status(200).json({
            filename,
            success: true,
            message: "Imagen subida satisfactoriamente."
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "No ha sido posible crear el post."
        });
    }
};

// Crea un nuevo post siendo usuario autenticado
postCtrl.createPost = async (req, res) => {
    try {
        let { body } = req;
        let post = new Post({
            author: req.user._id,
            ...body,
            slug: SlugGenerator(body.title)
        });
        // console.log("NUEVO POST", post);
        await post.save();
        return res.status(201).json({
            post,
            success: true,
            message: "Su post ha sido publicado."
        });
    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            success: false,
            message: "No ha sido posible crear el post."
        });
    }
};

postCtrl.updatePost = async (req, res) => {
    try {
        let { id } = req.params;
        let { user, body } = req;
        // Comprueba si el ID del post está en la base de datos o no
        let post = await Post.findById( id );
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "El post no ha sido encontrado.",
            });
        }
        // console.log(user._id);
        if (post.author.toString() !== user._id.toString()) {
            return res.status(401).json({
                success: false,
                message: "Este post no es suyo, ni le pertenece."
            });
        }
        post = await Post.findOneAndUpdate(
            { author: user._id, _id: id },
            {
              ...body,
              slug: SlugGenerator(body.title),
            },
            { new: true }
          );
        return res.status(200).json({
            post,
            success: true,
            message: "El post ha sido actualizado correctamente."
        });
    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            success: false,
            message: "No ha sido posible actualizar el post."
        });
    }
};

postCtrl.likePost = async (req, res) => {
    try {
        let { id } = req.params;
        let post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "El post no ha sido encontrado.",
            });
        }

        let user = post.likes.user.map((id) => id.toString());
        if (user.includes(req.user._id.toString())) {
          return res.status(404).json({
            success: false,
            message: "Usted ya le ha dado me gusta a este post.",
          });
        }

        post = await Post.findOneAndUpdate(
            { _id: id },
            {
              likes: {
                count: post.likes.count + 1,
                user: [...post.likes.user, req.user._id],
              },
            },
            { new: true }
          );
          return res.status(200).json({
            success: true,
            message: "Le has dado me gusta a este post."
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "No ha sido posible dar me gusta al post. Por favor, inténtelo de nuevo más tarde."
        });
    }
}

module.exports = postCtrl;