import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseRepositoryModule } from './repositories/course.repository.module';

@Module({
  providers: [CourseService],
  exports: [CourseService],
  imports: [CourseRepositoryModule],
})
export class CourseModule {}
