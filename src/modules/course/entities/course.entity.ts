import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import { ALL_GROUP } from 'src/common/database/constant/serialization-group.constant';
import { ChapterEntity } from 'src/modules/chapter/entities/chapter.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { CourseEnrollmentEntity } from '../../enrollment/entities/course-enrollements.entity';

@Entity({ name: 'course' })
export class CourseEntity extends DatabaseBaseEntity {
  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Column({ type: String, length: 255, unique: true, nullable: false })
  title?: string;

  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Column({ type: String, nullable: false, default: '' })
  description?: string;

  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Column({
    type: Number,
    nullable: false,
    default: 0,
  })
  price: number;

  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Column({ type: String, nullable: false })
  category?: string;

  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Column({ type: String, nullable: true })
  photoLink?: string;

  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Column({ type: Number, nullable: true, default: 0 })
  rating?: number;

  @OneToMany(() => ChapterEntity, (c) => c.course)
  chapters?: ChapterEntity[];

  @OneToMany(() => CourseEnrollmentEntity, (c) => c.course)
  enrollments?: CourseEnrollmentEntity[];
}
