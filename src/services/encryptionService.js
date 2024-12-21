const crypto = require('crypto');
const config = require('../config');

const ALGORITHM = 'aes-256-gcm';

module.exports = {
  encrypt(plainText) {
    const key = Buffer.from(config.encryptionKey, 'utf8'); // 32 bytes
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(plainText, 'utf8', 'base64');
    encrypted += cipher.final('base64');

    const authTag = cipher.getAuthTag();
    // Formato: iv:authTag:encrypted
    return `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted}`;
  },

  decrypt(encryptedText) {
    const [ivB64, authTagB64, encB64] = encryptedText.split(':');
    const key = Buffer.from(config.encryptionKey, 'utf8');
    const iv = Buffer.from(ivB64, 'base64');
    const authTag = Buffer.from(authTagB64, 'base64');

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    let decrypted = decipher.update(encB64, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }
};
