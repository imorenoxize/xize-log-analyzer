const app = require('./server');
const config = require('./config');
const logger = require('./utils/logger');

app.listen(config.port, () => {
  logger.info(`XIZE Log Analyzer running on port ${config.port}`);
});
