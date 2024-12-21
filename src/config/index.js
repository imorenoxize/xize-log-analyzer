require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  maxLogSizeMB: parseInt(process.env.MAX_LOG_SIZE_MB) || 256,
  jwtSecret: process.env.JWT_SECRET || 'default_jwt_secret',
  s3BucketName: process.env.S3_BUCKET_NAME || 'xize-logs-bucket',
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  awsRegion: process.env.AWS_DEFAULT_REGION || 'us-east-1',
  emailSmtpHost: process.env.EMAIL_SMTP_HOST,
  emailSmtpPort: process.env.EMAIL_SMTP_PORT,
  emailSmtpUser: process.env.EMAIL_SMTP_USER,
  emailSmtpPass: process.env.EMAIL_SMTP_PASS,
  notificationEmails: (process.env.NOTIFICATION_EMAILS || '').split(',').map(e => e.trim()).filter(Boolean),
  encryptionKey: process.env.ENCRYPTION_KEY,

  // Credenciales de admin
  adminUser: process.env.ADMIN_USER,
  adminPass: process.env.ADMIN_PASS
};
