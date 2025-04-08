import app from './app';
import logger from './utils/logger';
import { config } from './config';

// Add a simple test endpoint directly to the app
app.get('/test', (_, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    environment: config.env,
  });
});

// Add a health check endpoint
app.get('/health', (_, res) => {
  res.status(200).json({
    status: 'UP',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

const PORT = config.server.port;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});