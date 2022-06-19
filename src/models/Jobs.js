const { Schema, model } = require("mongoose");

const jobSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
    },
    categoria: {
        type: String,
        default: "Sin categoría",
        required: true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        default: "Sin ubicación",
        required: true
    },
    salario: {
        type: Number,
        required: false
    },
    duracion: {
        type: String,
        default: "Sin duración",
        required: false
    },
    horas: {
        type: Number,
        required: false
    },
    author: {
        type: String,
        required: true
    },
},
    {
        timestamps: true,
        versionKey: false
    }
);

module.exports = model("jobs", jobSchema);