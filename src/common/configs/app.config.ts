import { registerAs } from '@nestjs/config';
import { version } from '../../../package.json';
export default registerAs(
  'app',
  (): Record<string, any> => ({
    repoVersion: version,
    versioning: {
      enable: process.env.HTTP_VERSIONING_ENABLE === 'true' ?? false,
      prefix: 'v',
      version: process.env.HTTP_VERSION,
    },

    http: {
      host: process.env.HTTP_HOST ?? 'localhost',
      port: process.env.HTTP_PORT
        ? Number.parseInt(process.env.HTTP_PORT)
        : 3000,
    },
    frontUrl: process.env.FRONT_URL,
    env: process.env.APP_ENV,
    maxDatabaseTableBackup: process.env.MAX_DATABASE_TABLE_BACKUP_FILE,
    maxDatabaseBackup: process.env.MAX_DATABASE_BACKUP_FILE,
  }),
);
