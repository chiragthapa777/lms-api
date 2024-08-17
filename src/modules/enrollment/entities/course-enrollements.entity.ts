import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import { ALL_GROUP } from 'src/common/database/constant/serialization-group.constant';
import { PaymentEntity } from 'src/modules/payment/entities/payment.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { BigIntTransformerPipe } from 'src/utils/bigIntTransformer';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { CourseEntity } from '../../course/entities/course.entity';

@Entity({ name: 'course_enrollment' })
export class CourseEnrollmentEntity extends DatabaseBaseEntity {
  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Column({
    type: 'bigint',
    transformer: new BigIntTransformerPipe(),
    nullable: true,
  })
  courseId?: number;

  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Column({
    type: 'bigint',
    transformer: new BigIntTransformerPipe(),
    nullable: true,
  })
  userId?: number;

  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Column({
    type: Number,
    nullable: true,
  })
  rating?: number | null;

  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Column({ type: String, nullable: true })
  review?: string;

  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Column({
    type: 'bigint',
    transformer: new BigIntTransformerPipe(),
    nullable: true,
  })
  paymentId?: number;

  @OneToOne(() => PaymentEntity, (user) => user.id)
  @JoinColumn({
    name: 'paymentId',
  })
  payment?: PaymentEntity;

  @ManyToOne(() => UserEntity, (u) => u.enrollments)
  @JoinColumn({
    name: 'userId',
  })
  user?: UserEntity;

  @ManyToOne(() => CourseEntity, (u) => u.enrollments)
  @JoinColumn({
    name: 'courseId',
  })
  course?: CourseEntity;
}
