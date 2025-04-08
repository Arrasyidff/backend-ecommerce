import { PrismaClient } from '@prisma/client';
import { environmentConfig } from './environment';

export const prisma = new PrismaClient({
  log: environmentConfig.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export const databaseConfig = {
  url: environmentConfig.DATABASE_URL,
};