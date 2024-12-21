const fs = require('fs');
const path = require('path');

/**
 * Simula la subida a S3 guardando el archivo en src/logs/error-logs
 */
module.exports = {
  async uploadLogFile(key, content) {
    // e.g. key = "error-logs/<fecha>_<uuid>.log.enc"
    // logsDir = path.join(__dirname, '..', 'logs')
    const baseDir = path.join(__dirname, '..', 'logs');
    const filePath = path.join(baseDir, key);

    // Crear carpetas necesarias
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, content);
    return {
      localPath: filePath,
      message: 'Log guardado en almacenamiento local.'
    };
  }
};
