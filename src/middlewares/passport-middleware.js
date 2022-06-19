const passport = require("passport");
const User = require("../models/user");
const constants = require("../constants/index");
const Strategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const secretOrKey = constants.SECRET;

const opts = {
    secretOrKey,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  };

passport.use(
    new Strategy(opts, async ({ id }, done) => {
      // console.log(id);
      try {
        let user = await User.findById(id);
        if (!user) {
          throw new Error("Usuario no encontrado.");
        }
        return done(null, user.getUserInfo());
      } catch (err) {
        done(null, false);
      }
    })
  );