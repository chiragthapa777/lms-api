import { registerAs } from '@nestjs/config';
export default registerAs(
  'worker',
  (): Record<string, any> => ({
    idleTimeout: Number(process.env.WORKER_IDLE_TIMEOUT_MILLISECONDS),
    maxThreads: Number(process.env.WORKER_MAX_THREADS),
    minThreads: Number(process.env.WORKER_MIN_THREADS),
  }),
);
