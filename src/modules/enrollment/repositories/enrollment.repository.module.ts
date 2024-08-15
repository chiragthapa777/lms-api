import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseEnrollmentEntity } from '../entities/course-enrollements.entity';
import { EnrollmentRepository } from './enrollment.repository';

@Module({
  providers: [EnrollmentRepository],
  exports: [EnrollmentRepository],
  controllers: [],
  imports: [TypeOrmModule.forFeature([CourseEnrollmentEntity])],
})
export class EnrollmentRepositoryModule {}
