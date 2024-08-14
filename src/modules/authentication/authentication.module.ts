import { Module } from '@nestjs/common';
import { UserRepositoryModule } from '../user/repositories/user.repository.module';
import { UserModule } from '../user/user.module';
import { AuthenticationService } from './authentication.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [],
  providers: [AuthenticationService],
  imports: [UserRepositoryModule, UserModule, JwtModule],
  exports: [AuthenticationService, UserModule],
})
export class AuthenticationModule {}
