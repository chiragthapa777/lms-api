import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ChapterViewRepositoryModule } from '../chapter-view/repositories/chapter-view.repository.module';
import { EnrollmentModule } from '../enrollment/enrollement.module';
import { PaymentModule } from '../payment/payment.module';
import { CourseService } from './course.service';
import { CourseRepositoryModule } from './repositories/course.repository.module';

@Module({
  providers: [CourseService],
  exports: [
    CourseService,
    EnrollmentModule,
    HttpModule,
    ChapterViewRepositoryModule,
  ],
  imports: [
    CourseRepositoryModule,
    EnrollmentModule,
    PaymentModule,
    HttpModule,
    ChapterViewRepositoryModule,
  ],
})
export class CourseModule {}
