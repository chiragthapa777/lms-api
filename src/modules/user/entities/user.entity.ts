import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcryptjs';
import { Exclude, Expose } from 'class-transformer';
import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import { ALL_GROUP } from 'src/common/database/constant/serialization-group.constant';
import { BeforeInsert, BeforeUpdate, Column, Entity } from 'typeorm';
import { IUser } from '../interfaces/user.interface';

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
  avatar: string;

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
}
