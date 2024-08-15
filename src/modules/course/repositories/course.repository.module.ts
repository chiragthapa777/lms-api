import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseEntity } from '../entities/course.entity';
import { CourseRepository } from './course.repository';

@Module({
  providers: [CourseRepository],
  exports: [CourseRepository],
  controllers: [],
  imports: [TypeOrmModule.forFeature([CourseEntity])],
})
export class CourseRepositoryModule {}
