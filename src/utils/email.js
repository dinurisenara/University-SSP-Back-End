// utils/email.js
require('dotenv').config();
const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
    // Create a transporter
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com', // e.g., smtp.gmail.com
        port: 465, // e.g., 587
        secure: 'true', // true for 465, false for other ports
        auth: {
            user: 'damelzashekalbolt@gmail.com', // Your email
            pass: "cvev lrdz twnj qlup", // Your email password or app-specific password
        },
    });

    // Verify the connection configuration
    await transporter.verify();

    // Send mail with defined transport object
    const info = await transporter.sendMail({
        from: `"Your App Name" <${process.env.EMAIL_FROM}>`, // sender address
        to, // list of receivers
        subject, // Subject line
        html, // html body
    });

    console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
