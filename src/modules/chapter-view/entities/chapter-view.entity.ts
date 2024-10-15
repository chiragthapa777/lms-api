import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import { ALL_GROUP } from 'src/common/database/constant/serialization-group.constant';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { BigIntTransformerPipe } from 'src/utils/bigIntTransformer';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { ChapterEntity } from '../../chapter/entities/chapter.entity';

@Entity({ name: 'chapter-view' })
export class ChapterViewEntity extends DatabaseBaseEntity {
  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Column({
    type: 'bigint',
    transformer: new BigIntTransformerPipe(),
    nullable: true,
  })
  chapterId: number;

  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Column({
    type: 'bigint',
    transformer: new BigIntTransformerPipe(),
    nullable: true,
  })
  userId: number;

  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Column({
    type: Boolean,
    nullable: true,
  })
  completed: boolean;

  @ManyToOne(() => ChapterEntity, (c) => c.id)
  @JoinColumn({
    name: 'chapterId',
  })
  chapter?: ChapterEntity;

  @ManyToOne(() => UserEntity, (c) => c.id)
  @JoinColumn({
    name: 'userId',
  })
  user?: UserEntity;
}
