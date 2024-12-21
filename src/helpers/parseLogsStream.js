const fs = require('fs');
const readline = require('readline');
const errorPatterns = require('../utils/errorPatterns');

/**
 * Procesa un archivo de log línea por línea para detectar errores.
 * @param {string} filePath - Ruta al archivo de log.
 * @returns {Array} Listado de errores encontrados
 */

module.exports = async function parseLogsStream(filePath) {
  const foundErrors = [];
  const fileStream = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

  for await (const line of rl) {
    for (const patternObj of errorPatterns) {
      if (patternObj.pattern.test(line)) {
        foundErrors.push({
          name: patternObj.name,
          match: line
        });
      }
    }
  }

  return foundErrors;
};
