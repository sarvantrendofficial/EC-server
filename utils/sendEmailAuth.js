require('dotenv').config();
const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');

// --- 1. CONFIGURATION (Debug Mode) ---
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // CHANGED: 'service' to 'host'
    port: 465,
    secure: true, // Use true for port 465, false for all other ports
    auth: {
        user: 'sarvantrendofficial@gmail.com',
        pass: 'zeepwohfsbbgmezh'
    },
    tls: {
        rejectUnauthorized: false
    },
    logger: true, 
    debug: true   
});

// Verify connection on startup
transporter.verify(function (error, success) {
    if (error) {
        console.error("🔴 Transporter Error:", error);
    } else {
        console.log("🟢 Server is ready to take our messages");
    }
});

// --- 2. EMAIL FUNCTIONS ---

const sendVerificationEmail = async (email, otp) => {
    try {
        console.log(`Attempting to send OTP to: ${email}`); // Debug Log

        const templatePath = path.resolve(__dirname, '../html-files/otpverify-email-template.html');
        let htmlContent = await fs.readFile(templatePath, 'utf8');

        htmlContent = htmlContent
            .replace(/{otp}/g, otp)
            .replace(/{email}/g, email);

        const mailOptions = {
            from: `"Sarvan Trend" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Email Verification Code',
            html: htmlContent
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ OTP Email sent: %s", info.messageId);
        return info;

    } catch (error) {
        console.error('❌ Error sending verification email:', error);
        throw error;
    }
};

const verifySuccessEmail = async (email, name) => {
    try {
        const templatePath = path.resolve(__dirname, '../html-files/verifySuccess.html');
        let htmlContent = await fs.readFile(templatePath, 'utf8');

        htmlContent = htmlContent.replace(/{email}/g, name);

        const mailOptions = {
            from: `"Sarvan Trend" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Verification Successful',
            html: htmlContent
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Success Email sent: %s", info.messageId);
        return info;

    } catch (error) {
        console.error('❌ Error sending success email:', error);
        throw error;
    }
};

const PaymentSuccess = async (email, name, productName, productPrice) => {
    try {
        const templatePath = path.resolve(__dirname, '../html-files/PaymentSuccess.html');
        let htmlContent = await fs.readFile(templatePath, 'utf8');

        htmlContent = htmlContent
            .replace(/{email}/g, email)
            .replace(/{name}/g, name)
            .replace(/{productName}/g, productName)
            .replace(/{productPrice}/g, productPrice);

        const mailOptions = {
            from: `"Sarvan Trend" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Payment Successful',
            html: htmlContent
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Payment Email sent: %s", info.messageId);
        return info;

    } catch (error) {
        console.error('❌ Error sending payment email:', error);
        throw error;
    }
};

module.exports = { sendVerificationEmail, verifySuccessEmail, PaymentSuccess };
