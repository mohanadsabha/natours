const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

// For now only work for sending emails to users, later I will make for cntact form
module.exports = class Email {
    constructor(user, url) {
        this.from = `Mohanad Abusabha <${process.env.EMAIL_FROM}>`;
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
    }

    createTransporter() {
        if (process.env.NODE_ENV === 'production') {
            // Sendgrid
        }
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });
    }

    async send(template, subject) {
        const html = pug.renderFile(
            `${__dirname}/../views/email/${template}.pug`,
            {
                firstName: this.firstName,
                url: this.url,
                subject,
            },
        );
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.fromString(html),
        };
        await this.createTransporter().sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send('welcome', 'Welcome to the Natours Family!');
    }

    async sendPasswordReset() {
        await this.send(
            'passwordReset',
            'Your password reset token (valid for only 10 minutes)',
        );
    }
};
