import { Module } from '@nestjs/common';
import { UserRepositoryModule } from 'src/modules/user/repositories/user.repository.module';
import { UserService } from './user.service';

@Module({
  providers: [UserService],
  imports: [UserRepositoryModule],
  exports: [UserService],
})
export class UserModule {}
