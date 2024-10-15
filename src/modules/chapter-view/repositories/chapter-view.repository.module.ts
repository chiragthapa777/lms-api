import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChapterViewEntity } from '../entities/chapter-view.entity';
import { ChapterViewRepository } from './chapter-view.repository';

@Module({
  providers: [ChapterViewRepository],
  exports: [ChapterViewRepository],
  controllers: [],
  imports: [TypeOrmModule.forFeature([ChapterViewEntity])],
})
export class ChapterViewRepositoryModule {}
