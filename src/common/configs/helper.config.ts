import { registerAs } from '@nestjs/config';
import { seconds } from '../helper/constants/helper.function.constant';

export default registerAs(
  'helper',
  (): Record<string, any> => ({
    salt: {
      length: 8,
    },
    jwt: {
      secretKey: '123456',
      expirationTime: seconds('1h'),
      notBeforeExpirationTime: seconds('0'),
    },
    booking: {
      bookingSeatLimit: Number(process.env.BOOKING_SEAT_LIMIT),
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_DB_PASS,
    },
    maxRequest: process.env.MAX_REQUEST_HIT || 10,
    maxRequestTime:
      process.env.MAX_REQUEST_HIT_EXPIRATION_TIME_IN_SECONDS || 300,
    maxPasswordRequest: process.env.PASSWORD_MAX_REQUEST_LIMIT || 10,
  }),
);
