import { Module } from '@nestjs/common';
import { AuthenticationModule } from 'src/modules/authentication/authentication.module';
import { AuthenticationAdminController } from 'src/modules/authentication/controllers/authentication.admin.controller';
import { ChapterModule } from 'src/modules/chapter/chapter.module';
import { ChapterAdminController } from 'src/modules/chapter/controllers/chapter.admin.controller';
import { CourseAdminController } from 'src/modules/course/controllers/course.admin.controller';
import { CourseModule } from 'src/modules/course/course.module';
import { NoteAdminController } from 'src/modules/notes/controllers/note.admin.controller';
import { NoteModule } from 'src/modules/notes/note.module';
import { UserAdminController } from 'src/modules/user/controllers/user.admin.controller';
import { UserModule } from 'src/modules/user/user.module';

@Module({
  controllers: [
    AuthenticationAdminController,
    UserAdminController,
    ChapterAdminController,
    CourseAdminController,
    NoteAdminController,
  ],
  imports: [
    UserModule,
    AuthenticationModule,
    ChapterModule,
    CourseModule,
    NoteModule,
  ],
})
export class AdminRouterModule {}
