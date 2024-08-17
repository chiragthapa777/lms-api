import { Module } from '@nestjs/common';
import { NoteService } from './note.service';
import { NoteRepositoryModule } from './repositories/note.repository.module';

@Module({
  providers: [NoteService],
  exports: [NoteService],
  imports: [NoteRepositoryModule],
})
export class NoteModule {}
