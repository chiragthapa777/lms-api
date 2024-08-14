import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SmsService } from './service/sms.service';

@Module({
  providers: [SmsService],
  exports: [SmsService],
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async () => ({
        timeout: 30000, // 30 sec
      }),
      inject: [ConfigService],
    }),
  ],
})
export class SmsModule {}
