const { validationResult } = require("express-validator/check");

const validationMiddleware = (req, res, next) => {
    let errores = validationResult(req);
    if(!errores.isEmpty()) {
        return res.status(400).json({
            errores: errores.array(),
        });
    }
    next();
};

module.exports = validationMiddleware;