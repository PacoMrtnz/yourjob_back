const inscriptionCtrl = {};
const Inscriptions = require("../models/Inscriptions");
const Jobs = require("../models/Jobs");
const constants = require("../constants/index");
const SlugGenerator = require("../functions/slug-generator");
const user = require("../models/user");

inscriptionCtrl.createInscription = async (req, res) => {
    try {
        let { id } = req.params;
        let job = await Jobs.findById(id);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "El empleo no ha sido encontrado.",
            });
        }

        let userIdReq = req.user._id;
        // console.log(userIdReq);
        let inscription = await Inscriptions.findOne({ account: userIdReq, job: job });
        // console.log(inscription.account);
        if (inscription) {
            if (inscription.account.toString() === userIdReq.toString()) {
                return res.status(404).json({
                    inscription,
                    success: false,
                    message: "Usted ya se ha inscrito con anterioridad a este empleo.",
                });
            }
        }

        job = new Inscriptions({
            account: req.user._id,
            job: job
        });
        await job.save();

        return res.status(200).json({
            success: true,
            message: "Se ha inscrito satisfactoriamente a este empleo."
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "No se ha podido inscribir al empleo."
        });
    }
};


//Obtiene todas las inscripciones a los empleos que estén registradas con la id del usuario autenticado
inscriptionCtrl.getInscriptions = async (req, res) => {
    try {
        let id = req.user._id;
        let inscriptions = await Inscriptions.find({ account: id });
        if (inscriptions == null) {
            inscriptions = "Usted no se ha inscrito a ningún empleo"
        }
        // console.log(inscriptions);
        // console.log(req.user._id);
        res.status(201).json({
            inscriptions,
            success: true,
            message: "Se han obtenido todas las inscripciones a los empleos."
        });
    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            success: false,
            message: "No ha sido posible obtener todas las inscripciones a los empleos."
        });
    }
};

inscriptionCtrl.getInscription = async (req, res) => {
    try {
        // console.log(req.params);
        // const user = await User.findOne({_id: req.params.id});
        let id = req.user._id;
        let inscription = await Inscriptions.findById(req.params.id);
        let userInscriptions = await Inscriptions.find({ job: inscription.job, account: id });
        if (userInscriptions.length == 0) {
            return res.status(404).json({
                success: false,
                message: "Inscripción no encontrada o no le pertenece."
            });
        } else {
            res.status(201).json({
                inscription,
                success: true,
                message: "Se ha obtenido la inscripción al empleo satisfactoriamente."
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "No ha sido posible obtener la inscripción al empleo."
        });
    }
};


inscriptionCtrl.getInscriptionsAdm = async (req, res) => {
    try {
        const inscriptionsAdm = await Inscriptions.find();
        res.status(201).json({
            inscriptionsAdm,
            success: true,
            message: "Se han obtenido todas las inscripciones a los empleos."
        });

        // let id = req.user._id;
        // let inscriptions = await Inscriptions.find();
        // if (inscriptions.length == 0) {
        //     inscriptions = "Usted no se ha inscrito a ningún empleo"
        // } else {
        //     res.status(201).json({
        //         inscriptions,
        //         success: true,
        //         message: "Se han obtenido todas las inscripciones a los empleos."
        //     });
        // }
    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            success: false,
            message: "No ha sido posible obtener todas las inscripciones a los empleos."
        });
    }
};

inscriptionCtrl.getInscriptionAdm = async (req, res) => {
    try {
        // console.log(req.params);
        // const user = await User.findOne({_id: req.params.id});
        // let id = req.user._id;
        let id = req.params.id;
        let inscription = await Inscriptions.findById(id);
        // let userInscriptions = await Inscriptions.find({ job: inscription.job, account: id });
        res.status(201).json({
            inscription,
            success: true,
            message: "Se ha obtenido la inscripción al empleo satisfactoriamente."
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "No ha sido posible obtener la inscripción al empleo."
        });
    }
};


inscriptionCtrl.deleteInscription = async (req, res) => {
    try {
        let id = req.user._id;
        let inscription = await Inscriptions.findByIdAndDelete(req.params.id);
        let userInscriptions = await Inscriptions.find({ job: inscription.job, account: id });
        if (userInscriptions.length == 0) {
            return res.status(404).json({
                success: false,
                message: "Inscripción no encontrada o no le pertenece."
            });
        } else {
            res.status(201).json({
                inscription,
                success: true,
                message: "Se ha eliminado la inscripción al empleo."
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "No ha sido posible eliminar la inscripción al empleo."
        });
    }
};


inscriptionCtrl.deleteInscriptionAdm = async (req, res) => {
    try {
        let inscription = await Inscriptions.findByIdAndDelete(req.params.id);
        // res.send({ message: "User deleted" });
        res.status(201).json({
            success: true,
            message: "Inscripción eliminada satisfactoriamente."
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "No ha sido posible eliminar la inscripción al empleo."
        });
    }
};

module.exports = inscriptionCtrl;