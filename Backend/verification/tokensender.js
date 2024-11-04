const nodemailer = require('nodemailer');
const jwt  = require('jsonwebtoken');
const JWT_SECRET = require('../config');
const emailcredential = require('..config/');

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: emailcredential.email,
        pass: emailcredential.password
    }
});

const VerifyEmail=async (user)=>{
    const token = jwt.sign({
        username:user.username,
        email:user.email,
        password:user.password},JWT_SECRET,{expiresIn:'10m'});


const mailconfig = {
    from: 'blaise.stroman@ethereal.email',

    to: user.email,

    subject: "email verification",

    text: `Hi! Please verify your email by clicking on the link below:
               http://localhost:3000/verify/${token}`
};

await transporter.sendMail(mailconfig);
}
module.exports = VerifyEmail;