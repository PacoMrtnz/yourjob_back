const { Schema, model } = require("mongoose");
const { type } = require("os");
const hash = require("bcrypt").hash;
const compare = require("bcrypt").compare;
const sign = require("jsonwebtoken").sign;
const randomBytes = require("crypto").randomBytes;
const pick = require("lodash").pick;
const constants = require('../constants/index');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        // required: [true, 'El nombre de usuario ya existe'],
        unique: [true, "El nombre de usuario ya existe"]
    },
    email: {
        type: String,
        required: true,
        // required: [true, 'El email ya existe'],
        unique: [true, "El email ya existe"]
    },
    password: {
        type: String,
        required: true
    },
    accountType: {
        type: String,
        default: "user",
        required: true
    },
    verified: {
        type: Boolean,
        default: false
    },
    verificationCode: {
        type: String,
        required: false
    },
    resetPasswordToken: {
        type: String,
        required: false
    },
    resetPasswordExpiresIn: {
        type: Date,
        required: false
    },
    inscribed: [
        {
            ref: "jobs",
            type: Schema.Types.ObjectId,
            required: false
        }
    ]
}, {
    timestamps: true,
    versionKey: false
});

userSchema.pre("save", async function (next) {
    let user = this;
    if (!user.isModified("password")) return next();
    user.password = await hash(user.password, 10);
    next();
});

// userSchema.pre("update", async function (next) {
//     let user = this;
//     if (!user.isModified("password")) return next();
//     user.password = await hash(user.password, 10);
//     next();
// });

userSchema.methods.comparePassword = async function (password) {
    return await compare(password, this.password);
}

userSchema.methods.generateJWT = async function () {
    let payload = {
        username: this.username,
        email: this.email,
        password: this.password,
        id: this._id,
    }
    // return await sign(payload, constants.SECRET, { expiresIn: '1d' });   //Con expiración del token
    return await sign(payload, constants.SECRET, {});   //Sin expiración del token
}

userSchema.methods.generatePasswordReset = async function () {
    this.resetPasswordExpiresIn = Date.now() + 36000000;
    this.resetPasswordToken = randomBytes(20).toString("hex");
}

userSchema.methods.getUserInfo = function () {
    return pick(this, ["_id", "username", "email", "verified"]);
}

module.exports = model("users", userSchema);