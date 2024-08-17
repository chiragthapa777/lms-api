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
import { CourseEntity } from './entities/course.entity';
import { CourseRepository } from './repositories/course.repository';

@Injectable()
export class CourseService {
  constructor(private readonly repo: CourseRepository) {}

  async create(
    createDto: Partial<CourseEntity>,
    options?: ICreateOptions,
  ): Promise<CourseEntity> {
    const data = await this.repo._create(createDto, {
      entityManager: options?.entityManager,
    });
    return data;
  }

  async getById(
    id: number,
    options?: IFindOneOptions<CourseEntity>,
  ): Promise<CourseEntity | null> {
    const data = await this.repo._findOneById(id, options);
    return data;
  }

  async getOne(
    options: IFindOneOptions<CourseEntity>,
  ): Promise<CourseEntity | null> {
    const data = await this.repo._findOne(options);
    return data;
  }

  async getAll(
    options?: IFindAllOptions<CourseEntity>,
  ): Promise<CourseEntity[]> {
    return await this.repo._findAll(options);
  }

  async paginatedGet(options?: IPaginateFindOption<CourseEntity>): Promise<{
    data: CourseEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this.repo._paginateFind(options);
  }

  async paginatedQueryBuilderFind(
    options: IPaginateQueryBuilderOption<CourseEntity>,
  ): Promise<{
    data: CourseEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this.repo._paginatedQueryBuilder(options);
  }

  async softDelete(
    repo: CourseEntity,
    options?: IUpdateOptions<CourseEntity>,
  ): Promise<CourseEntity> {
    return await this.repo._softDelete(repo, options);
  }

  async delete(
    repo: CourseEntity,
    options?: IDeleteOptions<CourseEntity>,
  ): Promise<CourseEntity> {
    return await this.repo._delete(repo, options);
  }

  async restore(
    options: IUpdateRawOptions<CourseEntity>,
  ): Promise<UpdateResult> {
    return await this.repo._restoreRaw(options);
  }

  getQueryBuilder(name: string): SelectQueryBuilder<CourseEntity> {
    return this.repo._getQueryBuilder(name);
  }

  async update(
    repo: CourseEntity,
    updateData: Partial<CourseEntity>,
    options?: IUpdateOptions<CourseEntity>,
  ) {
    Object.assign(repo, updateData);
    return await this.repo._update(repo, {
      entityManager: options?.entityManager,
    });
  }
}
