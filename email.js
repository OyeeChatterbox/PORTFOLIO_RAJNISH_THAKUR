const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Sends an email notification based on the provided data.
 */
async function sendNotification(data) {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn("Email credentials not set. Skipping email notification.");
        return false;
    }

    const {
        timestamp,
        name,
        phone,
        email = 'N/A',
        courseCategory = 'N/A',
        selectedCourse = 'N/A',
        message = 'N/A',
        actionType,
        sourcePage,
        subject
    } = data;

    const emailContent = `
New Activity Detected

Name: ${name}
Phone: ${phone}
Email: ${email}

Course Category: ${courseCategory}
Selected Course: ${selectedCourse}

Action Type: ${actionType}

Date & Time: ${timestamp}

Source Page: ${sourcePage}

Message: ${message}
    `.trim();

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'forlogin759@gmail.com', // Explicitly requested owner email
        subject: subject || `New Activity: ${actionType}`,
        text: emailContent
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Email notification sent to forlogin759@gmail.com for ${actionType}`);
        return true;
    } catch (error) {
        console.error("Failed to send email notification:", error);
        return false;
    }
}

module.exports = { sendNotification };
