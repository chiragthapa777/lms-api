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
import { EnrollmentRepository } from '../enrollment/repositories/enrollment.repository';
import { CourseEnrollmentEntity } from '../enrollment/entities/course-enrollements.entity';

@Injectable()
export class EnrollmentService {
  constructor(private readonly repo: EnrollmentRepository) {}

  async create(
    createDto: Partial<CourseEnrollmentEntity>,
    options?: ICreateOptions,
  ): Promise<CourseEnrollmentEntity> {
    const data = await this.repo._create(createDto, {
      entityManager: options?.entityManager,
    });
    return data;
  }

  async getById(
    id: number,
    options?: IFindOneOptions<CourseEnrollmentEntity>,
  ): Promise<CourseEnrollmentEntity | null> {
    const data = await this.repo._findOneById(id, options);
    return data;
  }

  async getOne(
    options: IFindOneOptions<CourseEnrollmentEntity>,
  ): Promise<CourseEnrollmentEntity | null> {
    const data = await this.repo._findOne(options);
    return data;
  }

  async getAll(
    options?: IFindAllOptions<CourseEnrollmentEntity>,
  ): Promise<CourseEnrollmentEntity[]> {
    return await this.repo._findAll(options);
  }

  async paginatedGet(
    options?: IPaginateFindOption<CourseEnrollmentEntity>,
  ): Promise<{
    data: CourseEnrollmentEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this.repo._paginateFind(options);
  }

  async paginatedQueryBuilderFind(
    options: IPaginateQueryBuilderOption,
  ): Promise<{
    data: CourseEnrollmentEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this.repo._paginatedQueryBuilder(options);
  }

  async softDelete(
    repo: CourseEnrollmentEntity,
    options?: IUpdateOptions<CourseEnrollmentEntity>,
  ): Promise<CourseEnrollmentEntity> {
    return await this.repo._softDelete(repo, options);
  }

  async delete(
    repo: CourseEnrollmentEntity,
    options?: IDeleteOptions<CourseEnrollmentEntity>,
  ): Promise<CourseEnrollmentEntity> {
    return await this.repo._delete(repo, options);
  }

  async restore(
    options: IUpdateRawOptions<CourseEnrollmentEntity>,
  ): Promise<UpdateResult> {
    return await this.repo._restoreRaw(options);
  }

  getQueryBuilder(name: string): SelectQueryBuilder<CourseEnrollmentEntity> {
    return this.repo._getQueryBuilder(name);
  }

  async update(
    repo: CourseEnrollmentEntity,
    updateData: Partial<CourseEnrollmentEntity>,
    options?: IUpdateOptions<CourseEnrollmentEntity>,
  ) {
    Object.assign(repo, updateData);
    return await this.repo._update(repo, {
      entityManager: options?.entityManager,
    });
  }
}
