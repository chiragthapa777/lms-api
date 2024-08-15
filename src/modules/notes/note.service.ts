import { Injectable } from '@nestjs/common';
import { ICreateOptions } from 'src/common/database/interfaces/createOption.interface';
import { IDeleteOptions } from 'src/common/database/interfaces/deleteOption.interface';
import {
  IFindAllOptions,
  IFindOneOptions,
  IPaginateFindOption,
  IPaginateQueryBuilderOption,
} from 'src/common/database/interfaces/findOption.interface';
import {
  IUpdateOptions,
  IUpdateRawOptions,
} from 'src/common/database/interfaces/updateOption.interface';
import { IPaginationMeta } from 'src/common/response/interfaces/response.interface';
import { SelectQueryBuilder, UpdateResult } from 'typeorm';
import { NotesEntity } from './entities/note.entity';
import { NoteRepository } from './repositories/note.repository';

@Injectable()
export class NoteService {
  constructor(private readonly repo: NoteRepository) {}

  async create(
    createDto: Partial<NotesEntity>,
    options?: ICreateOptions,
  ): Promise<NotesEntity> {
    const data = await this.repo._create(createDto, {
      entityManager: options?.entityManager,
    });
    return data;
  }

  async getById(
    id: number,
    options?: IFindOneOptions<NotesEntity>,
  ): Promise<NotesEntity | null> {
    const data = await this.repo._findOneById(id, options);
    return data;
  }

  async getOne(
    options: IFindOneOptions<NotesEntity>,
  ): Promise<NotesEntity | null> {
    const data = await this.repo._findOne(options);
    return data;
  }

  async getAll(options?: IFindAllOptions<NotesEntity>): Promise<NotesEntity[]> {
    return await this.repo._findAll(options);
  }

  async paginatedGet(options?: IPaginateFindOption<NotesEntity>): Promise<{
    data: NotesEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this.repo._paginateFind(options);
  }

  async paginatedQueryBuilderFind(
    options: IPaginateQueryBuilderOption,
  ): Promise<{
    data: NotesEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this.repo._paginatedQueryBuilder(options);
  }

  async softDelete(
    repo: NotesEntity,
    options?: IUpdateOptions<NotesEntity>,
  ): Promise<NotesEntity> {
    return await this.repo._softDelete(repo, options);
  }

  async delete(
    repo: NotesEntity,
    options?: IDeleteOptions<NotesEntity>,
  ): Promise<NotesEntity> {
    return await this.repo._delete(repo, options);
  }

  async restore(
    options: IUpdateRawOptions<NotesEntity>,
  ): Promise<UpdateResult> {
    return await this.repo._restoreRaw(options);
  }

  getQueryBuilder(name: string): SelectQueryBuilder<NotesEntity> {
    return this.repo._getQueryBuilder(name);
  }

  async update(
    repo: NotesEntity,
    updateData: Partial<NotesEntity>,
    options?: IUpdateOptions<NotesEntity>,
  ) {
    Object.assign(repo, updateData);
    return await this.repo._update(repo, {
      entityManager: options?.entityManager,
    });
  }
}
