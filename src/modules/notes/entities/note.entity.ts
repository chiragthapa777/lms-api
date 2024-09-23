import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import { ALL_GROUP } from 'src/common/database/constant/serialization-group.constant';
import { ChapterEntity } from 'src/modules/chapter/entities/chapter.entity';
import { BigIntTransformerPipe } from 'src/utils/bigIntTransformer';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'note' })
export class NotesEntity extends DatabaseBaseEntity {
  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Column({ type: String, length: 255, nullable: false })
  title?: string;

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
  chapterId?: number;

  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Column({ type: String, nullable: true })
  content?: string;

  @ManyToOne(() => ChapterEntity, (user) => user.notes)
  @JoinColumn({
    name: 'chapterId',
  })
  chapter?: ChapterEntity;
}
