import {
  EntityManager,
  FindManyOptions,
  FindOneOptions,
  FindOptionsRelations,
  SelectQueryBuilder,
} from 'typeorm';

export enum SORT_ORDER_ENUM {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface IPaginationSetting<T = Record<string, any>> {
  sortableColumns?: (keyof T)[] | string[];
  searchableColumns?: (keyof T)[] | string[];
  defaultSearchColumns?: (keyof T)[] | string[];
  defaultSortColumn?: keyof T | string;
  defaultSortOrder?: 'DESC' | 'ASC';
  canSkipPagination?: boolean;
}

export interface IFindAllOptions<T> extends IPaginationSetting<T> {
  entityManager?: EntityManager;
  options?: FindManyOptions<T>;
  relations?: FindOptionsRelations<T> | boolean;
  transaction?: boolean;
  withDeleted?: boolean;
  sortOrder?: SORT_ORDER_ENUM;
  sortBy?: string;
  search?: string;
  searchBy?: string;
}

export interface IGetQueryBuilderOption {
  entityManager?: EntityManager;
}
export interface IFindOneOptions<T> {
  entityManager?: EntityManager;
  options?: FindOneOptions<T>;
  relations?: FindOptionsRelations<T> | boolean;
  transaction?: boolean;
  withDeleted?: boolean;
  failIfNotFound?: boolean;
}
export interface IPaginateFindOption<T> extends IFindAllOptions<T> {
  skipPagination?: boolean;
  page?: number;
  limit?: number;
}

export interface IPaginateQueryBuilderOption<T = any>
  extends IPaginationSetting<T> {
  skipPagination?: boolean;
  queryBuilder: SelectQueryBuilder<any>;
  builderName?: string;
  withDeleted?: boolean;
  sortOrder?: SORT_ORDER_ENUM;
  sortBy?: string;
  search?: string;
  searchBy?: string;
  page?: number;
  limit?: number;
}
