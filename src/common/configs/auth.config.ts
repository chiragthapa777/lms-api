import { registerAs } from '@nestjs/config';
import { seconds } from '../helper/constants/helper.function.constant';

export default registerAs(
  'auth',
  (): Record<string, any> => ({
    accessToken: {
      secretKey: process.env.AUTH_JWT_ACCESS_TOKEN_SECRET_KEY,
      expirationTime: seconds(
        process.env.AUTH_JWT_ACCESS_TOKEN_EXPIRED || '8h',
      ),
      notBeforeExpirationTime: seconds('0'),

      encryptKey: process.env.AUTH_JWT_PAYLOAD_ACCESS_TOKEN_ENCRYPT_KEY,
      encryptIv: process.env.AUTH_JWT_PAYLOAD_ACCESS_TOKEN_ENCRYPT_IV,
    },

    refreshToken: {
      secretKey: process.env.AUTH_JWT_REFRESH_TOKEN_SECRET_KEY,
      expirationTime: seconds(
        process.env.AUTH_JWT_REFRESH_TOKEN_EXPIRED || '14d',
      ),
      notBeforeExpirationTime: seconds('0'),

      encryptKey: process.env.AUTH_JWT_PAYLOAD_REFRESH_TOKEN_ENCRYPT_KEY,
      encryptIv: process.env.AUTH_JWT_PAYLOAD_REFRESH_TOKEN_ENCRYPT_IV,
    },

    subject: process.env.AUTH_JWT_SUBJECT,
    audience: process.env.AUTH_JWT_AUDIENCE,
    issuer: process.env.AUTH_JWT_ISSUER,
    prefixAuthorization: 'Bearer',
    payloadEncryption:
      process.env.AUTH_JWT_PAYLOAD_ENCRYPT === 'true' ? true : false,

    password: {
      attempt: true,
      maxAttempt: 5,
      saltLength: 8,
      expiredIn: seconds('182d'), // 182 days
    },
  }),
);
