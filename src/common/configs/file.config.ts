import { registerAs } from '@nestjs/config';
import bytes from 'bytes';

export default registerAs(
  'file',
  (): Record<string, any> => ({
    image: {
      maxFileSize: bytes(process.env.IMG_MAX_FILE_SIZE), // 1mb
      maxFiles: Number(process.env.IMG_MAX_FILE), // 3 files
    },
    video: {
      maxFileSize: bytes(process.env.VIDEO_MAX_FILE_SIZE), // 5.5mb
      maxFiles: Number(process.env.VIDEO_MAX_FILE), // 1 files
    },
    other: {
      maxFileSize: bytes(process.env.OTHER_MAX_FILE_SIZE || '5mb'), // 5.5mb
      maxFiles: Number(process.env.OTHER_MAX_FILE),
    },
  }),
);
