const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/auth');
const { analyzeLog } = require('../controllers/logAnalyzerController');
const { login } = require('../controllers/authController');

// Ruta de login para obtener token
router.post('/login', login);

// Ruta que requiere token
router.post('/analyze', authMiddleware, analyzeLog);

module.exports = router;