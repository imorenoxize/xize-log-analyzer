// src/services/notificationService.js
const nodemailer = require('nodemailer');
const config = require('../config');
const logger = require('../utils/logger');

const transporter = nodemailer.createTransport({
  host: config.emailSmtpHost,
  port: config.emailSmtpPort,
  secure: false,
  auth: {
    user: config.emailSmtpUser,
    pass: config.emailSmtpPass
  }
});

module.exports = {
  async sendEmailNotification(subject, text) {
    if(!config.notificationEmails || config.notificationEmails.length === 0) {
      logger.warn('No hay emails de notificación configurados');
      return;
    }

    const mailOptions = {
      from: `"XIZE Log Analyzer" <${config.emailSmtpUser}>`,
      to: config.notificationEmails.join(','),
      subject,
      text
    };

    await transporter.sendMail(mailOptions);
    logger.info('Notificación por email enviada', { to: config.notificationEmails });
  },

  async sendSmsNotification(subject, text) {
    logger.info('Notificación SMS simulada', { subject, text });
    // Ejemplo de POST a un endpoint SMS:
    // await axios.post('https://sms-endpoint.com/api', { subject, text });
  }
};
