const check = require('express-validator/check').check;

const title = check("title", "El título para el post es requerido.").not().isEmpty();
const content = check("content", "El contenido para el post es requerido.")
    .not()
    .isEmpty();

module.exports = {
    title: title,
    content: content
};