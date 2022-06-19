const randomBytes = require("crypto").randomBytes;
const userCtrl = {};
// const { validationResult } = require("express-validator/check");
const User = require("../models/User");
const Jobs = require("../models/Jobs");
// const userComparePassword = require("../models/user").comparePassword;
// const usergenerateJWT = require("../models/user").generateJWT;
// const usergetUserInfo = require("../models/user").getUserInfo;
const sendMail = require("../functions/email-sender");
const constants = require("../constants/index");
const { use } = require("passport");
const join = require("path").join;
const bcrypt = require("bcrypt");
const { exit } = require("process");
// const compareHash = require("bcrypt").compare;
// const user = require("../models/user");


// Obtiene todos los usuarios
userCtrl.getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

// Crea una cuenta de usuario, haciendo verificacion de si username o email ya existen
userCtrl.createUser =
  async (req, res) => {
    try {
      let { username, email, password, confirmPassword, accountType } = req.body;
      // Comprueba si el nombre de usuario ya existe o no
      let user = await User.findOne({ username });
      if (user) {
        return res.status(400).json({
          success: false,
          message: "El nombre de usuario ya se encuentra en uso",
        });
      }
      // Comprueba si el email ya existe o no
      user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({
          success: false,
          message:
            "El email ya se encuentra en uso. ¿Has olvidado la contraseña? Prueba a restablecerla",
        });
      }
      //Comprueba si password y confirmPassword son iguales
      if (password != confirmPassword) {
        return res.status(400).json({
          success: false,
          message:
            "Las contraseñas no coinciden",
        });
      }
      if (password.length < 6 || password.includes(" ") || confirmPassword.length < 6 || confirmPassword.includes(" ")) {
        return res.status(400).json({
          success: false,
          message:
            "La contraseña debe tener como mínimo 6 carácteres y no espacios en blanco",
        });
      }
      //Comprueba si accountType se está pasando desde el form
      if (!accountType) {
        return res.status(400).json({
          success: false,
          message:
            "Debe seleccionar un tipo de cuenta",
        });
      }

      user = new User({
        ...req.body,
        verificationCode: randomBytes(20).toString("hex"),
      });
      await user.save();
      // Enviar el email al usuario con un link de verificacion
      let html = `
              <div>
                  <h1>Hola, ${user.username}</h1>
                  <p>Por favor, haga clic sobre el siguiente enlace para verificar su cuenta.</p>
                  <a href="${constants.DOMAIN}api/users/verify-now/${user.verificationCode}">Verificar cuenta</a>
              </div>
          `;
      await sendMail(
        user.email,
        "YourJOB - Verificar Cuenta",
        "Por favor, verífique su cuenta.",
        html
      );
      return res.status(201).json({
        success: true,
        message:
          "¡Bravo! Su cuenta se ha creado, por favor, compruebe su bandeja de correo electrónico para verificar su cuenta",
      });
    } catch (err) {
      // console.log(err);
      return res.status(500).json({
        success: false,
        message: "Un error ocurrió."
      });
    }
  };

// Verificar cuenta de usuario via email
userCtrl.verifyNow =
  async (req, res) => {
    try {
      let { verificationCode } = req.params;
      // console.log(verificationCode);
      let user = await User.findOne({ verificationCode });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Acceso no autorizado. Código de verificación es inválido."
        });
      }
      user.verified = true;
      user.verificationCode = undefined;
      await user.save();
      return res.sendFile(join(__dirname, "../templates/verification-success.html"));
    } catch (error) {
      console.log("ERROR:", error.message);
      return res.sendFile(join(__dirname, "../templates/errors.html"));
    }
  };

// Se ejecuta la hora de autenticar algún usuario mediante nombre de usuario y contraseña
userCtrl.authenticate =
  async (req, res) => {
    try {
      let { username, password } = req.body;
      if (password.length < 6 || password.includes(" ")) {
        return res.status(400).json({
          success: false,
          message:
            "La contraseña debe tener como mínimo 6 carácteres y no espacios en blanco",
        });
      }
      let user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Nombre de usuario no encontrado"
        });
      }
      if (!await user.comparePassword(password)) {
        return res.status(401).json({
          success: false,
          message: "Contraseña incorrecta"
        });
      }
      // console.log(user.verified);
      if (!user.verified) {
        // Enviar el email al usuario con un link de verificacion
        let html = `
      <div>
          <h1>Hola, ${user.username}</h1>
          <p>Por favor, haga clic sobre el siguiente enlace para verificar su cuenta.</p>
          <a href="${constants.DOMAIN}api/users/verify-now/${user.verificationCode}">Verificar cuenta</a>
      </div>
  `;
        await sendMail(
          user.email,
          "YourJOB - Verificar Cuenta",
          "Por favor, verífique su cuenta.",
          html
        );
        return res.status(401).json({
          success: false,
          message: "No ha verificado su cuenta, compruebe su bandeja de correo electrónico"
        });
      }
      let token = await user.generateJWT();
      return res.status(200).json({
        success: true,
        user: user.getUserInfo(),
        token: `Bearer ${token}`,
        message: "¡Bien! Ahora estás conectado"
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Un error ocurrió"
      });
    }
  };

// Comprueba que el usuario esté autenticado
userCtrl.authenticated =
  async (req, res) => {
    // console.log("REQ", req);
    return res.status(200).json({
      user: req.user
    });
  };

userCtrl.resetPasswordProcess =
  async (req, res) => {
    try {
      let { email } = req.body;
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "El email de usuario no ha sido encontrado."
        });
      }
      user.generatePasswordReset();
      await user.save();
      // Enviar el enlace para restablecer contraseña en el email
      let html = `
      <div>
          <h1>Hola, ${user.username}</h1>
          <p>Por favor, haga clic sobre el siguiente enlace para restablecer su contraseña</p>
          <p>Si esta petición para restablecer su contraseña no ha sido solicitado por usted, entonces puede ignorar este mensaje.</p>
          <a href="${constants.DOMAIN}api/users/reset-password-now/${user.resetPasswordToken}">Verificar ahora</a>
      </div>
  `;
      await sendMail(
        user.email,
        "YourJOB - Restablecer Contraseña",
        "Por favor, restablezca su contraseña.",
        html
      );
      return res.status(200).json({
        success: true,
        message: "El enlace para restablecer su contraseña ha sido enviado a su email"
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Un error ocurrió."
      });
    }
  };

userCtrl.resetPasswordGet =
  async (req, res) => {
    try {
      let { resetPasswordToken } = req.params;
      let user = await User.findOne({ resetPasswordToken, resetPasswordExpiresIn: { $gt: Date.now() } });
      if (!user) {
        throw new Error("Usuario no encontrado con este Token de contraseña");
      }
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "El token para restablecer la contraseña no es válido o ha expirado"
        });
      }

      return res.sendFile(join(__dirname, "../templates/password-reset.html"));
    } catch (error) {
      return res.sendFile(join(__dirname, "../templates/errors.html"));
    }
  };

userCtrl.resetPasswordPost =
  async (req, res) => {
    try {
      let { resetPasswordToken, password } = req.body;
      let user = await User.findOne({ resetPasswordToken, resetPasswordExpiresIn: { $gt: Date.now() } });
      if (!user) {
        throw new Error("Usuario no encontrado con este Token de contraseña");
      }
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "El token para restablecer la contraseña no es válido o ha expirado"
        });
      }
      user.password = password;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpiresIn = undefined;
      await user.save();
      //Enviar notificación al email sobre el reseteo exitoso de contraseña
      let html = `
      <div>
          <h1>Hola, ${user.username}</h1>
          <p>Su contraseña ha sido restablecida satisfactoriamente.</p>
          <p>Si esta petición para restablecer su contraseña no ha sido elaborado por usted, póngase en contacto con nosotros.</p>
      </div>
  `;
      await sendMail(
        user.email,
        "YourJOB - Se ha restablecido su contraseña",
        "Su contraseña ha sido modificada.",
        html
      );
      // return res.sendFile(join(__dirname, "../templates/password-reset-successful.html"));
      return res.status(200).json({
        success: true,
        message: "Su solicitud de reseteo de contraseña ha sido completada y su contraseña ha sido restablecida satisfactoriamente. Ingrese a su cuenta con la nueva contraseña."
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Algo salió mal."
      });
    }
  };



//-----------------------------------

// userCtrl.getUser = async (req, res) => {
//   // console.log(req.params);
//   // const user = await User.findOne({_id: req.params.id});
//   const user = await User.findById(req.params._id);
//   res.send(user);
// };

userCtrl.updateUser = async (req, res) => {
  try {
    let id = req.params.id;
    let { username, email, accountType } = req.body;
    // console.log(req.body);

    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "El nombre de usuario ya se encuentra en uso",
      });
    }
    // Comprueba si el email ya existe o no
    user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message:
          "El email ya se encuentra en uso",
      });
    }
    //Comprueba si password y confirmPassword son iguales
    // if (password != confirmPassword) {
    //   return res.status(400).json({
    //     success: false,
    //     message:
    //       "Las contraseñas no coinciden",
    //   });
    // }
    //Comprueba si accountType se está pasando desde el form
    if (!accountType) {
      return res.status(400).json({
        success: false,
        message:
          "Debe seleccionar un tipo de cuenta",
      });
    }


    user = new User({
      ...req.body
      // verificationCode: randomBytes(20).toString("hex"),
    });
    // await user.update();
    // console.log(user);

    // console.log(req.body);

    // req.body.password = await bcrypt.hash(req.body.password, 10);
    await User.findOneAndUpdate({ _id: id }, req.body);

    return res.status(201).json({
      success: true,
      message:
        "Usuario actualizado con éxito",
    });
    // res.json({ body, message: "Usuario actualizado" });


  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      success: false,
      message: "Algo salió mal"
    });
  }


  // const updatedUser = await User.findByIdAndUpdate(req.params._id, req.body);
};

userCtrl.updatePasswordUser = async (req, res) => {
  try {
    let id = req.params.id;
    let { lastPassword, password, confirmPassword } = req.body;

    if (password.length < 6 || confirmPassword.length < 6 || password.includes(" ") || confirmPassword.includes(" ")) {
      return res.status(400).json({
        success: false,
        message: "Contraseña debe tener mínimo 6 carácteres y no espacios en blanco",
      });
    }

    //Comprueba si la anterior contraseña existe y está asociada a ese ID de usuario
    let user = await User.findOne({ _id: id, password: lastPassword });
    if (!user) {
      if (user) {
        return res.status(400).json({
          success: false,
          message: "La contraseña es incorrecta",
        });
      }
    }

    // Comprueba que no estén vacios
    if (password == "" || confirmPassword == "") {
      return res.status(400).json({
        success: false,
        message:
          "No puede poner una contraseña vacía",
      });
    }

    //Comprueba si password y confirmPassword son iguales
    if (password != confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Las contraseñas no coinciden",
      });
    }

    // console.log(req.body.password);
    // console.log(req.body.lastPassword.toString());

    bcrypt.compare(req.body.password, req.body.lastPassword, async (error, result) => {
      // console.log('Compared result', result, req.body.lastPassword)
      if (result) {
        return res.status(400).json({
          success: true,
          message:
            "La contraseña no puede ser igual a la anterior",
        });
      } else {

        req.body.password = await bcrypt.hash(req.body.password, 10);
        await User.findOneAndUpdate({ _id: id }, { password: req.body.password });

        return res.status(201).json({
          success: true,
          message:
            "Contraseña actualizada con éxito",
        });
      }

    });

  } catch (error) {
    // console.log(error);
    // console.log(error);
    return res.status(500).json({
      success: false,
      message: "Algo salió mal"
    });
  }
}

userCtrl.getUser = async (req, res) => {
  // console.log(req.params);
  // const employee = await Employee.findOne({_id: req.params.id});
  const user = await User.findById(req.params.id);
  res.send(user);
};

userCtrl.deleteUser = async (req, res) => {
  try {
    let userID = req.params.id;
    // console.log(req.params.id);
    let user = await User.findOne({ _id: userID });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No se ha encontrado ningún usuario con ese identificador",
      });
    }

    // console.log(user.username);
    await Jobs.deleteMany({ author: user.username });

    await User.findByIdAndDelete(req.params.id);

    // res.send({ message: "User deleted" });  
    return res.status(201).json({
      success: true,
      message:
        "Usuario eliminado con éxito",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Algo salió mal"
    });
  }

}


userCtrl.updateInscribeJob = async (req, res) => {
  try {
    let { body, user } = req;
    // console.log(user);
    // console.log(body);
    let jobId = body._id;
    let job = await User.findOne({ _id: user._id, inscribed: jobId });
    // console.log(job);
    if (job) {
      return res.status(400).json({
        success: false,
        message: "Ya estás inscrito a este empleo",
      });
    }

    job = await User.findOneAndUpdate(
      { _id: user._id },
      {
        $push:
          { inscribed: jobId }
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Se ha inscrito al empleo con éxito",
      job,
    });
  } catch (error) {
    // console.log(error);
    return res.status(500).json({
      success: false,
      message: "Algo salió mal al inscribirse al empleo"
    });
  }
}


userCtrl.deleteInscribedJob = async (req, res) => {
  try {
    let { body, user } = req;
    // console.log(body);
    // console.log(body._id);
    // console.log(user);
    let jobId = body._id;

    var usuario = await User.findOne({ _id: user._id, inscribed: jobId });
    // if(job) {
    // console.log(job);
    var index = usuario.inscribed.indexOf(jobId);
    // console.log(index);
    usuario.inscribed.splice(index, 1);
    usuario.save();
    // }
    // res.send({ message: "User deleted" });
    res.status(201).json({
      success: true,
      message: "Inscripción eliminada con éxito"
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "No ha sido posible eliminar la inscripción del empleo"
    });
  }
};

userCtrl.getAllInscribed = async (req, res) => {
  try {
    // console.log(req.params);
    let jobId = req.params.id;
    // console.log(jobId);
    const usuarios = await User.find({ inscribed: jobId });

    var infoProfiles = [];
    usuarios.forEach(usuario => {
      // var perfilUsuario = Profile.findOne({ account: usuario._id });
      infoProfiles.push(usuario);
    });
    res.status(201).json({
      usuarios,
      success: true,
      message: "Se han obtenido todos los usuarios inscritos"
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "No se ha podido obtener los usuarios inscritos"
    });
  }


};



module.exports = userCtrl;