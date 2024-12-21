const fs = require('fs');
const path = require('path');

module.exports = {
  async uploadLogFile(key, content) {
    const logsDir = path.join(__dirname, '..', 'logs');
    const filePath = path.join(logsDir, key);

    // Obtén el directorio padre del archivo a guardar
    const dir = path.dirname(filePath);

    // Crea la carpeta si no existe, usando { recursive: true } en Node 10+
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, content);
    return {
      localPath: filePath,
      message: 'Log guardado localmente en /logs'
    };
  }
};
