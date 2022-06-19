const randomBytes = require("crypto").randomBytes;
const profileCtrl = {};
// const { validationResult } = require("express-validator/check");
// const profileComparePassword = require("../models/profile").comparePassword;
// const profilegenerateJWT = require("../models/profile").generateJWT;
// const profilegetprofileInfo = require("../models/profile").getprofileInfo;
const sendMail = require("../functions/email-sender");
const Profile = require("../models/profile");
const constants = require("../constants/index");
const { Passport } = require("passport");
const join = require("path").join;
var ObjectId = require('mongodb').ObjectId;
const mongoose = require('mongoose');
const User = require("../models/user");
const { profile } = require("console");
// const profile = require("../models/profile");


profileCtrl.uploadCurriculum = async (req, res) => {
    try {
        let { body, file, user } = req;
        // console.log("FILE", file);
        if (!file) {
            return res.status(201).json({
                success: true,
                message: "No ha seleccionado ningún curriculum."
            });
        }
        let filename = constants.DOMAIN + "curriculums/" + file.filename;
        await Profile.findOneAndUpdate({ account: user._id }, { curriculum: filename });
        return res.status(201).json({
            filename,
            success: true,
            message: "Curriculum actualizado satisfactoriamente."
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "No ha sido posible subir el curriculum."
        });
    }
};

profileCtrl.uploadAvatar = async (req, res) => {
    try {
        let { body, file, user } = req;
        // console.log("FILE", file);
        if (!file) {
            return res.status(201).json({
                success: true,
                message: "No ha seleccionado ningún avatar."
            });
        }
        let filename = constants.DOMAIN + "post-images/" + file.filename;
        await Profile.findOneAndUpdate({ account: user._id }, { avatar: filename });
        return res.status(201).json({
            filename,
            success: true,
            message: "Avatar actualizado satisfactoriamente."
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "No ha sido posible subir el avatar."
        });
    }
}

// Crea el perfil para un usuario con su auth token
profileCtrl.createProfile = async (req, res) => {
    try {
        let { body, file, user } = req;
        // console.log(req.file);
        if (!file) {
            return res.status(201).json({
                success: true,
                message: "No ha seleccionado ninguna imagen."
            });
        }
        let path = constants.DOMAIN + file.path.split("uploads")[1];
        const profiles = await Profile.findOne({ account: user._id });
        if (profiles) {
            return res.status(201).json({
                success: true,
                message: "Ya existe un perfil creado asociado a esta cuenta de usuario."
            });
        }

        let profile = new Profile({
            social: body,
            account: user._id,
            avatar: path,
            curriculum: constants.DOMAIN + "undefined",
            social: {
                website: '',
                github: '',
                instagram: '',
                twitter: ''
            }
        });
        // console.log("USER-PROFILE", profile);
        await profile.save();

        return res.status(201).json({
            success: true,
            message: "Perfil creado correctamente."
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "No se ha podido crear el perfil."
        });
    }
};

profileCtrl.myProfile = async (req, res) => {
    try {
        let profile = await Profile.findOne({ account: req.user._id }).populate(
            "account",
            "username email"
        );
        if (!profile) {
            return res.status(400).json({
                success: false,
                message: "Su perfil no está creado."
            });
        }
        return res.status(200).json({
            success: true,
            profile
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "No se ha podido obtener el perfil."
        });
    }
};

// profileCtrl.updateProfile = async (req, res) => {
//     try {
//         let { body, file, user } = req;
//         let path = constants.DOMAIN + file.path.split("uploads")[1];
//         let profile = await Profile.findOneAndUpdate(
//             { account: user._id },
//             { social: body, avatar: path },
//             { new: true }
//         );
//         return res.status(200).json({
//             success: true,
//             message: "Su perfil se ha actualizado.",
//             profile,
//         });
//     } catch (err) {
//         console.log(err);
//         return res.status(500).json({
//             success: false,
//             message: "Algo salió mal.",
//         });
//     }
// };

profileCtrl.updateProfile = async (req, res) => {
    try {
        let { body, user } = req;
        // let path = constants.DOMAIN + file.path.split("uploads")[1];
        // console.log(body);
        let profile = await Profile.findOneAndUpdate(
            { account: user._id },
            { social: body },
            { new: true }
        );
        return res.status(200).json({
            success: true,
            message: "Su perfil se ha actualizado con éxito",
            profile,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Algo salió mal.",
        });
    }
};


profileCtrl.getUsername = async (req, res) => {
    try {
        let { username } = req.params;
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Usuario no encontrado."
            });
        }
        let profile = await Profile.findOne({ account: user._id });
        return res.status(200).json({
            profile: {
                ...profile.toObject(),
                account: user.getUserInfo()
            },
            success: true
        });
    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            success: false,
            message: "Algo salió mal"
        });
    }
};


profileCtrl.deleteProfile = async (req, res) => {
    try {
        let userID = req.params.id
        // console.log(req.params.id);
        let user = await Profile.findOne({ account: userID });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "No se ha encontrado ningún perfil asociado a ese identificador de usuario",
            });
        }

        await Profile.findOneAndDelete({ account: userID });
        // res.send({ message: "User deleted" });  
        return res.status(201).json({
            success: true,
            message:
                "Perfil eliminado con éxito",
        });
    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            success: false,
            message: "Algo salió mal"
        });
    }
}


module.exports = profileCtrl;