const nodemailer = require("nodemailer");
require("dotenv").config();

async function sendEmail({ from, to, subject, text, html}) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.APP_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false, // Bypass self-signed certificate issue
        },
      });

  const mailOptions = { from, to, subject, text, html };

  const info = await transporter.sendMail(mailOptions);
  console.log("Email sent successfully:", info.messageId);

  return info.messageId;
}

module.exports = { sendEmail };
