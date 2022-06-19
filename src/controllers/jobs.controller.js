const jobCtrl = {};
const Job = require("../models/Jobs");
const constants = require("../constants/index");
const SlugGenerator = require("../functions/slug-generator");
const User = require("../models/user");
const { forEach } = require("lodash");

jobCtrl.createJob = async (req, res) => {
    // console.log(req);
    try {
        let { body } = req;
        let username = req.user.username;
        // console.log(username);
        if (body.horas < 0 || body.salario < 0 || body.horas > 40 || body.salario > 500000) {
            return res.status(400).json({
                success: false,
                message: "Los campos numéricos de 'horas' (máx 40) y/o 'salario' (máx 500000) no pueden ser menores que 0 o superiores a sus máximos"
            });
        }
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "No hemos encontrado ningún usuario con ese nombre: @" + username
            });
        }
        // console.log(req.user.username);
        let job = new Job({
            author: req.user.username,
            ...body,
            slug: SlugGenerator(body.title)
        });
        // console.log("NUEVO POST", post);
        await job.save();
        return res.status(201).json({
            job,
            success: true,
            message: "Su empleo ha sido publicado con éxito"
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "No ha sido posible crear el empleo"
        });
    }
};

// Obtiene todos los empleos
jobCtrl.getJobs = async (req, res) => {
    try {
        const jobs = await Job.find();
        res.status(201).json({
            jobs,
            success: true,
            message: "Se han obtenido todos los empleos"
        });
    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            success: false,
            message: "No ha sido posible obtener los empleos"
        });
    }
};

// Obtiene todos los empleos de un username
jobCtrl.getJobsByUsername = async (req, res) => {
    try {
        let username = req.params.username;
        // console.log(req.params.username);
        const jobs = await Job.find({ author: username });
        res.status(201).json({
            jobs,
            success: true,
            message: "Se han obtenido todos los empleos"
        });
    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            success: false,
            message: "No ha sido posible obtener los empleos"
        });
    }
};

jobCtrl.getJob = async (req, res) => {
    try {
        // console.log(req.params);
        // const user = await User.findOne({_id: req.params.id});

        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({
                success: false,
                message: "Empleo no encontrado"
            });
        }

        // res.send(user);
        res.status(201).json({
            job,
            success: true,
            message: "Se ha obtenido el empleo satisfactoriamente"
        });
    } catch (error) {
        // console.log(error);
        return res.status(400).json({
            success: false,
            message: "No ha sido posible obtener el empleo"
        });
    }
};

jobCtrl.deleteJob = async (req, res) => {
    try {
        let { body, user } = req;
        let jobId = body._id;
        // console.log(jobId);

        //Elimina la inscripción del empleo a borrar de todos los usuarios
        const users = User.find();
        ((await users).forEach(usuario => {
            usuario.inscribed.pull(jobId);
            usuario.save();
        }));

        await Job.findByIdAndDelete(jobId);

        res.status(201).json({
            success: true,
            message: "Empleo eliminado satisfactoriamente"
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "No ha sido posible eliminar el empleo"
        });
    }
};


jobCtrl.updateJob = async (req, res) => {
    try {
        let { body } = req;
        if (body.horas < 0 || body.salario < 0 || body.horas > 40 || body.salario > 500000) {
            return res.status(400).json({
                success: false,
                message: "Los campos numéricos de 'horas' (máx 40) y/o 'salario' (máx 500000) no pueden ser menores que 0 o superiores a sus máximos"
            });
        }
        let job = new Job({
            author: req.user._id,
            ...body,
            slug: SlugGenerator(body.title)
        });
        // console.log("NUEVO POST", post);
        await Job.findByIdAndUpdate(req.params.id, req.body);
        return res.status(201).json({
            job,
            success: true,
            message: "Empleo actualizado correctamente"
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "No ha sido posible editar el empleo"
        });
    }
};


module.exports = jobCtrl;