import { Module } from '@nestjs/common';
import { AuthenticationModule } from 'src/modules/authentication/authentication.module';
import { AuthenticationAdminController } from 'src/modules/authentication/controllers/authentication.admin.controller';
import { UserAdminController } from 'src/modules/user/controllers/user.admin.controller';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  controllers: [AuthenticationAdminController, UserAdminController],
  imports: [UserModule, AuthenticationModule],
})
export class AdminRouterModule {}
