import { Module } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentRepositoryModule } from './repositories/enrollment.repository.module';

@Module({
  providers: [EnrollmentService],
  exports: [EnrollmentService],
  imports: [EnrollmentRepositoryModule],
})
export class EnrollmentModule {}
