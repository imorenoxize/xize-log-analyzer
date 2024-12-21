const jwt = require('jsonwebtoken');
const config = require('../config');
const logger = require('../utils/logger');

module.exports = {
  async login(req, res) {
    try {
      const { username, password } = req.body;

      // Validar campos
      if (!username || !password) {
        return res.status(400).json({ error: 'Missing username or password' });
      }

      // Comparar con env
      if (username !== config.adminUser || password !== config.adminPass) {
        logger.warn('Intento de login fallido', { username });
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // Credenciales válidas => generar JWT
      const payload = {
        user: username,
        role: 'admin'
      };

      const options = {
        expiresIn: '2h'  // Token válido por 2 horas
      };

      const token = jwt.sign(payload, config.jwtSecret, options);
      logger.info('Login exitoso', { user: username });

      return res.json({ token });
    } catch (error) {
      logger.error('Error en /login', { error: error.message });
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};
