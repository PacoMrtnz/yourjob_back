const { Schema, model } = require("mongoose");

const profileSchema = new Schema({
    account: {
        ref: "users",
        type: Schema.Types.ObjectId,
    },
    avatar: {
        type: String,
        required: false
    },
    curriculum: {
        type: String,
        required: false
    },
    social: {
        website: {
            type: String,
            required: false
        },
        github: {
            type: String,
            required: false
        },
        instagram: {
            type: String,
            required: false
        },
        twitter: {
            type: String,
            required: false
        }
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = model("profiles", profileSchema);