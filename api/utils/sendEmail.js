const nodemailer = require("nodemailer");
const sendEmail = async (options) => {
  // 1)-create transporter Object(the service that will send the email:"gmail","mailgun","mailtrap","sendgrid")
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: process.env.Email_HOST,
    port: process.env.Email_PORT, //if secure is false port=587(TLS is used instead) if true port = 465(use SSL)
    secure: true,
    sender: process.env.Email,
    auth: {
      type: "login",
      user: process.env.Email,
      pass: process.env.Email_PASSWORD,
    },
  });
  // 2)- define email options (from, to,subject,Email content etc...)
  const emailOptions = {
    from: "ZamZam APP",
    to: options.email,
    subject: options.subject,
    text: options.content,
  };
  // 3) - send the email
  await transporter.sendMail(emailOptions);
};
module.exports = { sendEmail };
