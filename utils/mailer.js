const nodemailer = require('nodemailer');
require('dotenv').config(); // load .env variables

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: false, // true for port 465
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendRegistrationEmail = async (to, name) => {
  const mailOptions = {
    from: `"latogo" <${process.env.MAIL_FROM_ADDRESS}>`,
    to,
    subject: 'Welcome to Our Platform',
    html: `<h3>Hi ${name},</h3>
           <p>Thank you for registering on our platform.</p>
           <p>We're glad to have you with us!</p>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendRegistrationEmail,
};
