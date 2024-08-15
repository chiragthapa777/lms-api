import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChapterEntity } from '../entities/chapter.entity';
import { ChapterRepository } from './chapter.repository';

@Module({
  providers: [ChapterRepository],
  exports: [ChapterRepository],
  controllers: [],
  imports: [TypeOrmModule.forFeature([ChapterEntity])],
})
export class ChapterRepositoryModule {}
