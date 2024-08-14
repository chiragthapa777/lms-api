import { Module } from '@nestjs/common';
import { AuthenticationModule } from 'src/modules/authentication/authentication.module';
import { UserStudentController } from 'src/modules/user/controllers/user.student.controller';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  controllers: [UserStudentController],
  imports: [UserModule, AuthenticationModule],
})
export class StudentRouterModule {}
