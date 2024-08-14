import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcryptjs';
import { Exclude, Expose } from 'class-transformer';
import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import {
  ALL_GROUP
} from 'src/common/database/constant/serialization-group.constant';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity
} from 'typeorm';

export const USER_TABLE_NAME = 'chapters';
@Entity({ name: USER_TABLE_NAME })
export class UserEntity extends DatabaseBaseEntity  {

  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Column({ type: String, length: 255, unique: true, nullable: false })
  title: string;

  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Column({ type: String, nullable: false })
  content: string;

  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Column({ type: 'bigint', nullable: true })
  courseId: number;

  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Column({ type: Number, nullable: true })
  index: number;
  

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

}
