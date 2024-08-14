import { Module } from '@nestjs/common';
import { AuthenticationModule } from 'src/modules/authentication/authentication.module';
import { AuthenticationController } from 'src/modules/authentication/controllers/authentication.controller';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  controllers: [AuthenticationController],
  imports: [UserModule, AuthenticationModule],
})
export class UserRouterModule {}
