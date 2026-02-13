require('dotenv').config();
const sgMail = require('@sendgrid/mail');
const fs = require('fs').promises;
const path = require('path');

// --- 1. CONFIGURATION ---
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const senderEmail = process.env.EMAIL_FROM; // Must be verified in SendGrid

// --- 2. EMAIL FUNCTIONS ---

const sendVerificationEmail = async (email, otp) => {
    try {
        const templatePath = path.resolve(__dirname, '../html-files/otpverify-email-template.html');
        let htmlContent = await fs.readFile(templatePath, 'utf8');

        htmlContent = htmlContent
            .replace(/{otp}/g, otp)
            .replace(/{email}/g, email);

        const msg = {
            to: email,
            from: senderEmail, // Verified sender
            subject: 'Email Verification Code - Sarvan Trend',
            html: htmlContent,
        };

        await sgMail.send(msg);
        console.log(`✅ OTP Email sent to ${email}`);
        return true;

    } catch (error) {
        console.error('❌ Error sending verification email:', error);
        if (error.response) {
            console.error(error.response.body);
        }
        throw error;
    }
};

const verifySuccessEmail = async (email, name) => {
    try {
        const templatePath = path.resolve(__dirname, '../html-files/verifySuccess.html');
        let htmlContent = await fs.readFile(templatePath, 'utf8');

        htmlContent = htmlContent.replace(/{email}/g, name);

        const msg = {
            to: email,
            from: senderEmail,
            subject: 'Verification Successful - Sarvan Trend',
            html: htmlContent,
        };

        await sgMail.send(msg);
        console.log(`✅ Success Email sent to ${email}`);
        return true;

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

        const msg = {
            to: email,
            from: senderEmail,
            subject: 'Payment Successful - Sarvan Trend',
            html: htmlContent,
        };

        await sgMail.send(msg);
        console.log(`✅ Payment Email sent to ${email}`);
        return true;

    } catch (error) {
        console.error('❌ Error sending payment email:', error);
        throw error;
    }
};

module.exports = { sendVerificationEmail, verifySuccessEmail, PaymentSuccess };