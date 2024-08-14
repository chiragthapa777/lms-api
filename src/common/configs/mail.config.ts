import { registerAs } from '@nestjs/config';

export default registerAs(
  'mail',
  (): Record<string, any> => ({
    pass: process.env?.PASSWORD,
    email: process.env?.EMAIL,
    secure: process.env?.SECURE ?? false,
    port: process?.env.PORT,
    host: process.env.HOST,
    service: process.env?.SERVICE,
    sender: process.env?.SENDER,
  }),
);
