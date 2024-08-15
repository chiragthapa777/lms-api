import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '../../../common/database/base/repositories/base.repository';
import { NotesEntity } from '../entities/note.entity';

@Injectable()
export class NoteRepository extends BaseRepository<NotesEntity> {
  constructor(
    @InjectRepository(NotesEntity)
    private usersRepository: Repository<NotesEntity>,
  ) {
    super(usersRepository);
  }
}
