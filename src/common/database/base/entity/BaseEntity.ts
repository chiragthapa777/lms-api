import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { BigIntTransformerPipe } from 'src/utils/bigIntTransformer';
import {
  BaseEntity,
  CreateDateColumn,
  DeleteDateColumn,
  Generated,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  ADMIN_ONLY_GROUP,
  ALL_GROUP,
  DELETE_AT_FIELD_GROUP,
} from '../../constant/serialization-group.constant';

export class DatabaseBaseEntity extends BaseEntity {
  // __entity?: string;

  // @AfterLoad()
  // setEntityName() {
  //   this.__entity = this.constructor.name;
  // }

  // toJSON() {
  //   console.log('tests');
  //   return instanceToPlain(this);
  // }
  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Generated()
  @PrimaryColumn({
    type: 'bigint',
    transformer: new BigIntTransformerPipe(),
  })
  id: number;

  @Expose({ groups: ADMIN_ONLY_GROUP })
  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @Expose({ groups: ADMIN_ONLY_GROUP })
  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;

  @Expose({ groups: DELETE_AT_FIELD_GROUP })
  @DeleteDateColumn({ type: 'timestamptz', name: 'deleted_at' })
  deletedAt: Date;
}
