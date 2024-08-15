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
import { PaymentRepository } from './repositories/payment.repository';
import { PaymentEntity } from './entities/payment.entity';

@Injectable()
export class PaymentService {
  constructor(private readonly repo: PaymentRepository) {}

  async create(
    createDto: Partial<PaymentEntity>,
    options?: ICreateOptions,
  ): Promise<PaymentEntity> {
    const data = await this.repo._create(createDto, {
      entityManager: options?.entityManager,
    });
    return data;
  }

  async getById(
    id: number,
    options?: IFindOneOptions<PaymentEntity>,
  ): Promise<PaymentEntity | null> {
    const data = await this.repo._findOneById(id, options);
    return data;
  }

  async getOne(
    options: IFindOneOptions<PaymentEntity>,
  ): Promise<PaymentEntity | null> {
    const data = await this.repo._findOne(options);
    return data;
  }

  async getAll(
    options?: IFindAllOptions<PaymentEntity>,
  ): Promise<PaymentEntity[]> {
    return await this.repo._findAll(options);
  }

  async paginatedGet(options?: IPaginateFindOption<PaymentEntity>): Promise<{
    data: PaymentEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this.repo._paginateFind(options);
  }

  async paginatedQueryBuilderFind(
    options: IPaginateQueryBuilderOption,
  ): Promise<{
    data: PaymentEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this.repo._paginatedQueryBuilder(options);
  }

  async softDelete(
    repo: PaymentEntity,
    options?: IUpdateOptions<PaymentEntity>,
  ): Promise<PaymentEntity> {
    return await this.repo._softDelete(repo, options);
  }

  async delete(
    repo: PaymentEntity,
    options?: IDeleteOptions<PaymentEntity>,
  ): Promise<PaymentEntity> {
    return await this.repo._delete(repo, options);
  }

  async restore(
    options: IUpdateRawOptions<PaymentEntity>,
  ): Promise<UpdateResult> {
    return await this.repo._restoreRaw(options);
  }

  getQueryBuilder(name: string): SelectQueryBuilder<PaymentEntity> {
    return this.repo._getQueryBuilder(name);
  }

  async update(
    repo: PaymentEntity,
    updateData: Partial<PaymentEntity>,
    options?: IUpdateOptions<PaymentEntity>,
  ) {
    Object.assign(repo, updateData);
    return await this.repo._update(repo, {
      entityManager: options?.entityManager,
    });
  }
}
