const nodeemail = require('nodemailer');
const env = require('dotenv');
env.config({ path: './config.env' });

const sendEmail = async options => {
  const transporter = nodeemail.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions={
    from:"Abbos G`ulomov",
    to:options.email,
    subject:options.subject,
    text:options.message
  }
   await transporter.sendMail(mailOptions)

};
module.exports=sendEmail