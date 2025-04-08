import dotenv from 'dotenv';
import { cleanEnv, str, port } from 'envalid';

dotenv.config();

export const environmentConfig = cleanEnv(process.env, {
  NODE_ENV: str({ choices: ['development', 'production', 'test'], default: 'development' }),
  PORT: port({ default: 3000 }),
  DATABASE_URL: str(),
  JWT_SECRET: str(),
  JWT_EXPIRES_IN: str({ default: '1d' }),
  LOG_LEVEL: str({ choices: ['error', 'warn', 'info', 'http', 'debug'], default: 'info' }),
});