import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/database/base/repositories/base.repository';
import { ChapterViewEntity } from '../entities/chapter-view.entity';

@Injectable()
export class ChapterViewRepository extends BaseRepository<ChapterViewEntity> {
  constructor(
    @InjectRepository(ChapterViewEntity)
    private chapterRepo: Repository<ChapterViewEntity>,
  ) {
    super(chapterRepo);
  }
}
