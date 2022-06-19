const check = require('express-validator/check').check;

const title = check("title", "El título para el empleo es requerido").not().isEmpty();
const description = check("description", "La descripción para el empleo es requerida").not().isEmpty();
// const categoria = check("categoria", "La categoría para el empleo es requerida.").not().isEmpty();

module.exports = {
    title: title,
    description: description,
};