import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseRepositoryModule } from './repositories/course.repository.module';
import { EnrollmentModule } from '../enrollment/enrollement.module';
import { PaymentModule } from '../payment/payment.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  providers: [CourseService],
  exports: [CourseService, EnrollmentModule, HttpModule],
  imports: [
    CourseRepositoryModule,
    EnrollmentModule,
    PaymentModule,
    HttpModule,
  ],
})
export class CourseModule {}
