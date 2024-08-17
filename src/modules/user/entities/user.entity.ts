import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcryptjs';
import { Exclude, Expose } from 'class-transformer';
import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import { ALL_GROUP } from 'src/common/database/constant/serialization-group.constant';
import { CourseEnrollmentEntity } from 'src/modules/enrollment/entities/course-enrollements.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import { IUser } from '../interfaces/user.interface';
import { PaymentEntity } from 'src/modules/payment/entities/payment.entity';
import { NotesEntity } from 'src/modules/notes/entities/note.entity';

export const USER_TABLE_NAME = 'users';

export enum USER_ROLE {
  USER = 'USER',
  ADMIN = 'ADMIN',
}
@Entity({ name: USER_TABLE_NAME })
export class UserEntity extends DatabaseBaseEntity implements IUser {
  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Column({ type: String, length: 255, unique: true, nullable: false })
  email: string;

  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Column({ type: String, nullable: false })
  name: string;

  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Column({ type: String, nullable: true })
  avatar?: string;

  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Column({ type: String, nullable: true })
  role: USER_ROLE;

  @ApiProperty()
  @Exclude()
  @Column({ type: 'text', nullable: true, select: false })
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPasswordBeforeInsertOrUpdate() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @OneToMany(() => CourseEnrollmentEntity, (r) => r.userId)
  enrollments?: CourseEnrollmentEntity[];

  @OneToMany(() => PaymentEntity, (r) => r.userId)
  payments?: PaymentEntity[];

  @OneToMany(() => NotesEntity, (r) => r.userId)
  notes?: NotesEntity[];
}
