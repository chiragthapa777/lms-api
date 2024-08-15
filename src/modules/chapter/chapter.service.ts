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
import { ChapterEntity } from './entities/chapter.entity';
import { ChapterRepository } from './repositories/chapter.repository';

@Injectable()
export class ChapterService {
  constructor(private readonly repo: ChapterRepository) {}

  async create(
    createDto: Partial<ChapterEntity>,
    options?: ICreateOptions,
  ): Promise<ChapterEntity> {
    const data = await this.repo._create(createDto, {
      entityManager: options?.entityManager,
    });
    return data;
  }

  async getById(
    id: number,
    options?: IFindOneOptions<ChapterEntity>,
  ): Promise<ChapterEntity | null> {
    const data = await this.repo._findOneById(id, options);
    return data;
  }

  async getOne(
    options: IFindOneOptions<ChapterEntity>,
  ): Promise<ChapterEntity | null> {
    const data = await this.repo._findOne(options);
    return data;
  }

  async getAll(
    options?: IFindAllOptions<ChapterEntity>,
  ): Promise<ChapterEntity[]> {
    return await this.repo._findAll(options);
  }

  async paginatedGet(options?: IPaginateFindOption<ChapterEntity>): Promise<{
    data: ChapterEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this.repo._paginateFind(options);
  }

  async paginatedQueryBuilderFind(
    options: IPaginateQueryBuilderOption,
  ): Promise<{
    data: ChapterEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this.repo._paginatedQueryBuilder(options);
  }

  async softDelete(
    repo: ChapterEntity,
    options?: IUpdateOptions<ChapterEntity>,
  ): Promise<ChapterEntity> {
    return await this.repo._softDelete(repo, options);
  }

  async delete(
    repo: ChapterEntity,
    options?: IDeleteOptions<ChapterEntity>,
  ): Promise<ChapterEntity> {
    return await this.repo._delete(repo, options);
  }

  async restore(
    options: IUpdateRawOptions<ChapterEntity>,
  ): Promise<UpdateResult> {
    return await this.repo._restoreRaw(options);
  }

  getQueryBuilder(name: string): SelectQueryBuilder<ChapterEntity> {
    return this.repo._getQueryBuilder(name);
  }

  async update(
    repo: ChapterEntity,
    updateData: Partial<ChapterEntity>,
    options?: IUpdateOptions<ChapterEntity>,
  ) {
    Object.assign(repo, updateData);
    return await this.repo._update(repo, {
      entityManager: options?.entityManager,
    });
  }
}
