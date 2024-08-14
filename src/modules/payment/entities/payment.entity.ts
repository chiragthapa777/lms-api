import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import { ALL_GROUP } from 'src/common/database/constant/serialization-group.constant';
import { CourseEnrollmentEntity } from 'src/modules/enrollment/entities/course-enrollements.entity';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { BigIntTransformerPipe } from 'src/utils/bigIntTransformer';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';

@Entity({ name: 'payment' })
export class PaymentEntity extends DatabaseBaseEntity {
  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Column({ type: String, length: 255, nullable: false })
  remark?: string;

  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Column({
    type: 'bigint',
    transformer: new BigIntTransformerPipe(),
    nullable: false,
  })
  userId?: number;

  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Column({
    type: 'bigint',
    transformer: new BigIntTransformerPipe(),
    nullable: true,
  })
  enrollmentId?: number;

  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Column({ type: Number, nullable: true })
  amount?: string;

  @ManyToOne(() => UserEntity, (user) => user.id)
  @JoinColumn({
    name: 'userId',
  })
  user?: UserEntity;

  @OneToOne(() => CourseEnrollmentEntity, (user) => user.id)
  @JoinColumn({
    name: 'enrollmentId',
  })
  enrollment?: CourseEnrollmentEntity;
}
