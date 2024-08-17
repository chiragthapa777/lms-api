import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseRepositoryModule } from './repositories/course.repository.module';
import { EnrollmentModule } from '../enrollment/enrollement.module';
import { PaymentModule } from '../payment/payment.module';

@Module({
  providers: [CourseService],
  exports: [CourseService, EnrollmentModule],
  imports: [CourseRepositoryModule, EnrollmentModule, PaymentModule],
})
export class CourseModule {}
