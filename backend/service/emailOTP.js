const nodemailer = require('nodemailer');
const fs = require('fs').promises;
const path = require('path');

let transporter = nodemailer.createTransport({
    host: "smtp.zoho.in",
    secure: true,
    port: 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

async function sendOtpEmail(to, name, otp) {
    try {
        const templatePath = path.join(__dirname, '../', 'email-templates', 'otp-template.html');
        let template = await fs.readFile(templatePath, 'utf-8');
        template = template.replace(/{{name}}/g, name);
        template = template.replace(/{{otp}}/g, otp);

        const mailOptions = {
            from: '"Milaap" <milaap@iam-abhi.site>',
            to: to,
            subject: 'Your OTP Code',
            html: template
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.log('Error sending email:', error);
    }
}

module.exports = { sendOtpEmail };
