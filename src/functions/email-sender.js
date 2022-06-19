const sgMail = require("@sendgrid/mail");
const constants = require("../constants/index");

sgMail.setApiKey(constants.SENDGRID_API);

const sendMail = async (email, subject, text, html) => {
    try {
        const msg = {
          html,
          text,
          subject,
          to: email,
          from: constants.HOST_EMAIL,
        };
        // console.log(msg);
        await sgMail.send(msg);
        console.log("MAIL_ENVIADO");
      } catch (err) {
        console.log("ERROR_MAILING", err);
      } finally {
        return;
      }
};

module.exports = sendMail;

