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
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { DeepPartial, SelectQueryBuilder, UpdateResult } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(private readonly userRepo: UserRepository) {}

  async create(
    createDto: DeepPartial<UserEntity & { profilePictureId: number }>,
    options?: ICreateOptions,
  ): Promise<UserEntity> {
    const data = await this.userRepo._create(createDto, {
      entityManager: options?.entityManager,
    });
    return data;
  }

  async getById(
    id: number,
    options?: IFindOneOptions<UserEntity>,
  ): Promise<UserEntity | null> {
    const data = await this.userRepo._findOneById(id, options);
    return data;
  }

  async getOne(
    options: IFindOneOptions<UserEntity>,
  ): Promise<UserEntity | null> {
    const data = await this.userRepo._findOne(options);
    return data;
  }

  async getAll(options?: IFindAllOptions<UserEntity>): Promise<UserEntity[]> {
    return await this.userRepo._findAll(options);
  }

  async paginatedGet(options?: IPaginateFindOption<UserEntity>): Promise<{
    data: UserEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this.userRepo._paginateFind(options);
  }

  async paginatedQueryBuilderFind(
    options: IPaginateQueryBuilderOption,
  ): Promise<{
    data: UserEntity[];
    _pagination: IPaginationMeta;
  }> {
    return await this.userRepo._paginatedQueryBuilder(options);
  }

  async softDelete(
    repo: UserEntity,
    options?: IUpdateOptions<UserEntity>,
  ): Promise<UserEntity> {
    return await this.userRepo._softDelete(repo, options);
  }

  async delete(
    repo: UserEntity,
    options?: IDeleteOptions<UserEntity>,
  ): Promise<UserEntity> {
    return await this.userRepo._delete(repo, options);
  }

  async restore(options: IUpdateRawOptions<UserEntity>): Promise<UpdateResult> {
    return await this.userRepo._restoreRaw(options);
  }

  getQueryBuilder(name: string): SelectQueryBuilder<UserEntity> {
    return this.userRepo._getQueryBuilder(name);
  }

  async update(
    repo: UserEntity,
    updateData: any,
    options?: IUpdateOptions<UserEntity>,
  ) {
    Object.assign(repo, updateData);
    return await this.userRepo._update(repo, {
      entityManager: options?.entityManager,
    });
  }
}
