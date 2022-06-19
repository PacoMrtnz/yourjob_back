const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const join = require("path").join;
const usersApi = require("./routes/user.routes");
const profilesApi = require("./routes/profile.routes");
const postsApi = require("./routes/posts.routes");
const jobsApi = require("./routes/jobs.routes");
const inscriptionApi = require("./routes/inscriptions.routes");
const sendmailApi = require("./routes/sendmail.routes");
const constants = require('./constants/index');
// const bodyparser = require("body-parser");
const passport = require("passport");
// const formData = require("express-form-data");
const os = require("os");
// Import de passport middleware
const passportMiddleware = require("./middlewares/passport-middleware");
const { upperCase } = require("lodash");
const { body } = require("express-validator/check");

// Inicializa la aplicación express
const app = express();
// app.use("/api/users", usersApi);
app.set("port", constants.PORT);

app.use(cors());
app.use(passport.initialize());
app.use(express.static(join(__dirname, "./uploads")));
app.use(morgan('dev'));
app.use(express.json());
// app.use(express);
app.use(express.urlencoded({ extended: false }));
// app.use(bodyparser.json());
// app.use(bodyparser.urlencoded({ extended: false }));
// app.use(function(err, req, res, next) {
//     res.status(err.status || 500).json(response.error(err.status || 500));
// });

/**
 * Options are the same as multiparty takes.
 * But there is a new option "autoClean" to clean all files in "uploadDir" folder after the response.
 * By default, it is "false".
 */
//  const options = {
//     uploadDir: os.tmpdir(),
//     autoClean: true
//   };
// parse data with connect-multiparty. 
// app.use(formData.parse(options));
// // delete from the request all empty files (size == 0)
// app.use(formData.format());
// // change the file objects to fs.ReadStream 
// // app.use(formData.stream());
// // union the body and the files
// app.use(formData.union());

app.use("/api/users", usersApi);
app.use("/api/profiles", profilesApi);
app.use("/api/posts", postsApi);
app.use("/api/jobs", jobsApi);
app.use("/api/inscriptions", inscriptionApi);
app.use("/api/sendmail", sendmailApi);

module.exports = app;