const sendMailCtrl = {};
const nodeMailer = require("nodemailer");

sendMailCtrl.sendMail = (req, res) => {
    let body = req.body;
    // console.log(body);

    let config = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        auth:{
            user:'fmartinezmartin.daw@gmail.com',
            pass:'XXXXXXXXXXXX'
        }
    });

    const options = {
        from: body.email,
        subject: body.asunto,
        to: "yourjob.soporte@gmail.com",
        text: body.mensaje
    };

    config.sendMail(options, (error, result) => {
        if(error) {
            console.log(error);
            return res.json({success:false, message:error})};
        return res.json({
            success: true,
            message: result
        });
    });
}

module.exports = sendMailCtrl;