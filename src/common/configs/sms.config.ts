import { registerAs } from '@nestjs/config';

export default registerAs(
  'sms',
  (): Record<string, any> => ({
    sparrow_base: process.env?.SPARROW_BASE_URL,
    sparrow_token: process.env?.SPARROW_SMS_TOKEN,
    sparrow_sender: process?.env.SPARROW_SENDER,

    aakash_base: process.env?.AAKASH_SMS_BASE_URL,
    aakash_token: process.env?.AAKASH_SMS_AUTH,
  }),
);
