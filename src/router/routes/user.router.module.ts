import { Module } from '@nestjs/common';
import { AuthenticationModule } from 'src/modules/authentication/authentication.module';
import { AuthenticationController } from 'src/modules/authentication/controllers/authentication.controller';
import { ChapterModule } from 'src/modules/chapter/chapter.module';
import { ChapterController } from 'src/modules/chapter/controllers/chapter.controller';
import { CourseController } from 'src/modules/course/controllers/course.controller';
import { CourseModule } from 'src/modules/course/course.module';
import { NoteController } from 'src/modules/notes/controllers/note.controller';
import { NoteModule } from 'src/modules/notes/note.module';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  controllers: [
    AuthenticationController,
    ChapterController,
    CourseController,
    NoteController,
  ],
  imports: [
    UserModule,
    AuthenticationModule,
    ChapterModule,
    CourseModule,
    NoteModule,
  ],
})
export class UserRouterModule {}
