require("dotenv").config();

const valorDB = process.env.MONGODB_URI;
const valorSECRET = process.env.APP_SECRET;
const valorDOMAIN = process.env.APP_DOMAIN;
const valorHOST_EMAIL = process.env.APP_HOST_EMAIL;
const valorSENDGRID_API = process.env.SENDGRID_API;
const valorPORT = process.env.PORT || process.env.APP_PORT;

module.exports = {
    DB: valorDB,
    SECRET: valorSECRET,
    DOMAIN: valorDOMAIN,
    HOST_EMAIL: valorHOST_EMAIL,
    SENDGRID_API: valorSENDGRID_API,
    PORT: valorPORT,
};