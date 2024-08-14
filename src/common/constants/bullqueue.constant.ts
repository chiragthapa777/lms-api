import { JobOptions } from 'bull';
export const HTTP_LOG_JOB = 'http-log-jobs';
export const jobOptions: JobOptions = {
  removeOnComplete: true,
  // removeOnFail: true,
  // removeOnComplete: {
  //   age: 3600, // keep up to 1 hour
  //   count: 1000, // keep up to 1000 jobs
  // },
  removeOnFail: {
    age: 24 * 3600, // keep up to 24 hours
  },
  priority: 1, // highest job priority to avoid job waiting as mush as possible to reduce latency
  timeout: 1 * 60 * 1000,
};
