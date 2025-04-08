import { databaseConfig } from './database';
import { environmentConfig } from './environment';

export const config = {
  env: environmentConfig.NODE_ENV,
  server: {
    port: environmentConfig.PORT,
  },
  database: databaseConfig,
  jwt: {
    secret: environmentConfig.JWT_SECRET,
    expiresIn: environmentConfig.JWT_EXPIRES_IN,
  },
  logging: {
    level: environmentConfig.LOG_LEVEL,
  },
};