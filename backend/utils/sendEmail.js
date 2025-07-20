const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    // 1. Create a transporter (the service that will send the email)
    const transporter = nodemailer.createTransport({
        host: process.env.BREVO_HOST,
        port: process.env.BREVO_PORT,
        auth: {
            user: process.env.BREVO_USER,
            pass: process.env.BREVO_API_KEY, // This is the API key
        },
    });

    // 2. Define the email options
    const mailOptions = {
        from: `ProTrack <${process.env.BREVO_USER}>`, // Sender address
        to: options.email, // List of receivers
        subject: options.subject, // Subject line
        html: options.html, // HTML body
    };

    // 3. Actually send the email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully via Brevo!");
};

module.exports = sendEmail;
