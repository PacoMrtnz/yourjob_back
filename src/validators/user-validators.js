const check = require('express-validator/check').check;
// const validationResult = require('express-validator/check').validationResult;

const username = check("username", "Nombre de usuario es requerido.").not().isEmpty();
const email = check("email", "Proporcione una dirección de correo válida").isEmail();
const password = check(
  "password",
  "Contraseña requiere un mínimo de 6 carácteres."
).isLength({
  min: 6,
});

const valorRegisterValidations = [email, username, password];
const valorAuthenticateValidations = [username, password];
const valorResetPassword = [email];  
const valorUserValidations = [email, username];

module.exports = {
  RegisterValidations: valorRegisterValidations,
  AuthenticateValidations: valorAuthenticateValidations,
  ResetPassword: valorResetPassword,
  UserValidations: valorUserValidations
};