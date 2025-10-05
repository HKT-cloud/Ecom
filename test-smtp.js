const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a test transporter
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

// Verify connection configuration
transporter.verify(function(error, success) {
    if (error) {
        console.error('SMTP Connection Error:', error);
    } else {
        console.log('Server is ready to send emails');
        
        // Send test email
        const mailOptions = {
            from: `"Test" <${process.env.SMTP_USER}>`,
            to: process.env.SMTP_USER, // Send to yourself for testing
            subject: 'Test Email',
            text: 'This is a test email from your application',
            html: '<b>This is a test email from your application</b>'
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.error('Error sending email:', error);
            }
            console.log('Test email sent:', info.messageId);
        });
    }
});
