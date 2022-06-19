const Schema = require("mongoose").Schema;
const model = require("mongoose").model;

const inscriptionSchema = new Schema({
    account: {
        ref: "users",
        type: Schema.Types.ObjectId,
    },
    job: {
        ref: "jobs",
        type: Schema.Types.ObjectId
    }
},
    { 
    timestamps: true,  
    versionKey: false 
    }
);

module.exports = model("inscriptions", inscriptionSchema);