const jwt = require('jsonwebtoken');
const config = require('../config');
const logger = require('../utils/logger');

module.exports = function(req, res, next) {
  const token = req.headers['xize_analyzer_token'];
  if(!token) {
    logger.warn('Solicitud sin token JWT');
    return res.status(401).json({error: 'Missing token'});
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    logger.warn('Token inválido', {error: err.message});
    return res.status(403).json({error: 'Invalid token'});
  }
};
