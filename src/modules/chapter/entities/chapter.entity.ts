import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { DatabaseBaseEntity } from 'src/common/database/base/entity/BaseEntity';
import { ALL_GROUP } from 'src/common/database/constant/serialization-group.constant';
import { CourseEntity } from 'src/modules/course/entities/course.entity';
import { NotesEntity } from 'src/modules/notes/entities/note.entity';
import { BigIntTransformerPipe } from 'src/utils/bigIntTransformer';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { ChapterViewEntity } from '../../chapter-view/entities/chapter-view.entity';

@Entity({ name: 'chapter' })
export class ChapterEntity extends DatabaseBaseEntity {
  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Column({ type: String, length: 255, nullable: false })
  title?: string;

  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Column({ type: String, nullable: false })
  content?: string;

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
  @Column({ type: String, nullable: true })
  videoLink?: string;

  @ApiProperty()
  @Expose({ groups: ALL_GROUP })
  @Column({ type: Number, nullable: true })
  index?: number;

  @ManyToOne(() => CourseEntity, (c) => c.id)
  @JoinColumn({
    name: 'courseId',
  })
  course?: CourseEntity;

  @OneToMany(() => NotesEntity, (a) => a.chapter)
  notes: NotesEntity[];

  @OneToMany(() => ChapterViewEntity, (a) => a.chapter)
  views: ChapterViewEntity[];
}
