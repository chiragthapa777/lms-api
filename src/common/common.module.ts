import { Module } from '@nestjs/common/decorators';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/modules/user/user.module';
import { AuthModule } from './auth/auth.module';
import configs from './configs';
import { DatabaseModule } from './database/database.module';
import { DebuggerModule } from './debugger/debugger.module';
import { ErrorModule } from './error/error.module';
import { HelperModule } from './helper/helper.module';
import { MailerModule } from './mailer/mailer.module';
import { RequestModule } from './request/request.module';
import { ResponseModule } from './response/response.module';
import { SmsModule } from './sms/sms.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: configs,
      envFilePath: ['.env'],

      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    DatabaseModule,
    RequestModule,
    ResponseModule,
    ErrorModule,
    MailerModule,
    SmsModule,
    AuthModule,
    HelperModule,
    DebuggerModule,
  ],
  exports: [],
})
export class CommonModule {}
