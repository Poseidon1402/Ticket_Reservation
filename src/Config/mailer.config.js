require('dotenv').config();
const mailer = require('nodemailer');

const mailerConfig = {
    host:  process.env.MAILER_HOST,
    auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD
    } 
};

module.exports = mailer.createTransport(mailerConfig);