const express = require('express');
const routes = require('./routes/routes');
const config = require('./config');
const requestLogger = require('./middleware/requestLogger');

const app = express();

app.use(express.json({ limit: `${config.maxLogSizeMB}mb` }));
app.use(express.urlencoded({ extended: true, limit: `${config.maxLogSizeMB}mb` }));

app.use(requestLogger);

// Prefijo de rutas
app.use('/api', routes);

module.exports = app;
