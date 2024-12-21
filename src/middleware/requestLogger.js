const logger = require('../utils/logger');

module.exports = function(req, res, next) {
  logger.info('Nueva petición entrante', {
    method: req.method,
    url: req.originalUrl,
    headers: req.headers
  });
  next();
};
