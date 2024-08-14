import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/modules/user/entities/user.entity';

@Module({
  providers: [UserRepository],
  exports: [UserRepository],
  controllers: [],
  imports: [TypeOrmModule.forFeature([UserEntity])],
})
export class UserRepositoryModule {}
