import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/database/base/repositories/base.repository';
import { CourseEnrollmentEntity } from '../entities/course-enrollements.entity';

@Injectable()
export class EnrollmentRepository extends BaseRepository<CourseEnrollmentEntity> {
  constructor(
    @InjectRepository(CourseEnrollmentEntity)
    private usersRepository: Repository<CourseEnrollmentEntity>,
  ) {
    super(usersRepository);
  }
}
