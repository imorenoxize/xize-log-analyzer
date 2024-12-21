// src/controllers/logAnalyzerController.js
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

const parseLogsStream = require('../helpers/parseLogsStream');
const encryptionService = require('../services/encryptionService');
const notificationService = require('../services/notificationService');
const localStorageService = require('../services/localStorageService');
const config = require('../config');

module.exports = {
  async analyzeLog(req, res) {
    try {
      const { log: logContent = '', isBase64, isEncrypted, return: returnResp } = req.body;

      // 1. Decodificar Base64
      let rawLog = isBase64 ? Buffer.from(logContent, 'base64').toString('utf8') : logContent;

      // 2. Desencriptar si aplica
      if (isEncrypted) {
        rawLog = encryptionService.decrypt(rawLog);
      }

      // 3. Guardar el log en un archivo temporal
      const tempDir = path.join(__dirname, '..', 'temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir, { recursive: true });
      }
      const tempFileName = `${uuidv4()}.log`;
      const tempFilePath = path.join(tempDir, tempFileName);
      fs.writeFileSync(tempFilePath, rawLog);

      // 4. Procesar con streaming
      const errorsFound = await parseLogsStream(tempFilePath);

      // Configuramos la respuesta
      const responseData = {
        status: 'ok',
        errors: errorsFound.map(e => e.name) // e.name = "WSDL Load Error", etc.
      };

      // 5. Si hay errores, guardamos una versión encriptada y enviamos UNA sola notificación
      if (errorsFound.length > 0) {
        // Encriptar todo el log para almacenarlo
        const encryptedLog = encryptionService.encrypt(rawLog);
        // Nombre del archivo final en local
        const key = `error-logs/${new Date().toISOString()}_${uuidv4()}.log.enc`;

        // Subir (guardar localmente) el archivo encriptado
        await localStorageService.uploadLogFile(key, encryptedLog);

        // Enviar un único email con el listado de errores
        const subject = `XIZE Log Analyzer - Errores detectados en el log`;
        const preview = rawLog.substring(0, 200);
        // Ejemplo: e.match = "ERROR: Parsing WSDL..."
        const firstError = errorsFound[0].match;
        const text = `Se encontraron ${errorsFound.length} errores.\nEjemplo: ${firstError}\nPrevisualización:\n${preview}...\nRuta local: ${key}`;

        // Notificación
        await notificationService.sendEmailNotification(subject, text);
        // También podrías enviar notificación SMS o a endpoint
        // await notificationService.sendSmsNotification(subject, text);
      }

      // 6. Responder al cliente
      if (returnResp) {
        return res.json(responseData);
      } else {
        return res.status(204).send(); // No Content
      }
    } catch (err) {
      logger.error('Error analizando el log', { error: err.message, stack: err.stack });
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};
