import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotesEntity } from '../entities/note.entity';
import { NoteRepository } from './note.repository';

@Module({
  providers: [NoteRepository],
  exports: [NoteRepository],
  controllers: [],
  imports: [TypeOrmModule.forFeature([NotesEntity])],
})
export class NoteRepositoryModule {}
