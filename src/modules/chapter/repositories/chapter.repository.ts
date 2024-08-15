import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/database/base/repositories/base.repository';
import { ChapterEntity } from '../entities/chapter.entity';

@Injectable()
export class ChapterRepository extends BaseRepository<ChapterEntity> {
  constructor(
    @InjectRepository(ChapterEntity)
    private chapterRepo: Repository<ChapterEntity>,
  ) {
    super(chapterRepo);
  }
}
