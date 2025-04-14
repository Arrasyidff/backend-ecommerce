import { Queue } from 'bullmq';
import { redis } from '../config/redis';

export const invoiceQueue = new Queue('invoice', {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
  },
});