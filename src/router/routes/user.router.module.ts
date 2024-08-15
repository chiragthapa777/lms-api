import { Module } from '@nestjs/common';
import { AuthenticationModule } from 'src/modules/authentication/authentication.module';
import { AuthenticationController } from 'src/modules/authentication/controllers/authentication.controller';
import { ChapterModule } from 'src/modules/chapter/chapter.module';
import { ChapterController } from 'src/modules/chapter/controllers/chapter.controller';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  controllers: [AuthenticationController, ChapterController],
  imports: [UserModule, AuthenticationModule, ChapterModule],
})
export class UserRouterModule {}
