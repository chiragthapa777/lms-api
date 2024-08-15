import { Module } from '@nestjs/common';
import { ChapterService } from './chapter.service';
import { ChapterRepositoryModule } from './repositories/chapter.repository.module';

@Module({
  providers: [ChapterService],
  exports: [ChapterService],
  imports: [ChapterRepositoryModule],
})
export class ChapterModule {}
