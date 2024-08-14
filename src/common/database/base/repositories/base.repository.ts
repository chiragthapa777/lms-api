import { IPaginationMeta } from 'src/common/response/interfaces/response.interface';
import {
  Brackets,
  DeepPartial,
  DeleteResult,
  EntityManager,
  FindManyOptions,
  FindOptionsRelations,
  ILike,
  InsertResult,
  Raw,
  Repository,
  SelectQueryBuilder,
  UpdateResult,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { ICreateOptions } from '../../interfaces/createOption.interface';
import { IDeleteRawOptions } from '../../interfaces/deleteOption.interface';
import {
  IFindAllOptions,
  IFindOneOptions,
  IGetQueryBuilderOption,
  IPaginateFindOption,
  IPaginateQueryBuilderOption,
} from '../../interfaces/findOption.interface';
import {
  IUpdateOptions,
  IUpdateRawOptions,
} from '../../interfaces/updateOption.interface';
import { DatabaseBaseEntity } from '../entity/BaseEntity';

export interface Result {
  data: any[];
  _pagination: IPaginationMeta;
}

export abstract class BaseRepository<T extends DatabaseBaseEntity> {
  protected _entityRepo: Repository<T>;
  protected _relations?: FindOptionsRelations<T>;

  constructor(entityRepo: Repository<T>, relations?: FindOptionsRelations<T>) {
    this._entityRepo = entityRepo;
    this._relations = relations;
  }

  _getQueryBuilder(
    alias: string,
    options?: IGetQueryBuilderOption,
  ): SelectQueryBuilder<T> {
    if (options?.entityManager) {
      return options.entityManager.createQueryBuilder(
        this._entityRepo.target,
        alias,
      );
    } else {
      return this._entityRepo.createQueryBuilder(alias);
    }
  }

  async _create(
    createDto: DeepPartial<T>,
    options?: ICreateOptions,
  ): Promise<T> {
    if (options?.entityManager) {
      const entity = options.entityManager.create(
        this._entityRepo.target,
        createDto,
      );
      return await options.entityManager.save(this._entityRepo.target, entity);
    }
    const entity = this._entityRepo.create(createDto);
    return await this._entityRepo.save(entity);
  }

  /**
   * create bulk record at once and return array of id
   * @param createDto array of entity
   * @param options
   * @returns [number] - array of id
   * example result : {
        identifiers: [ { id: '3' }], // only ids
        generatedMaps: [ // only db defaults
          {
            id: '3',
            createdAt: 2024-05-24T07:10:02.170Z,
            updatedAt: 2024-05-24T07:10:02.170Z,
            deletedAt: null,
            isServiceAvailable: false
          }
        ],
      }
   */
  async _createBulk(
    createDto: QueryDeepPartialEntity<T>[],
    options?: ICreateOptions,
  ): Promise<InsertResult> {
    let result: InsertResult;
    if (options?.entityManager) {
      result = await options.entityManager
        .createQueryBuilder(this._entityRepo.target, 'entity')
        .insert()
        .values(createDto)
        .execute();
    } else {
      result = await this._entityRepo
        .createQueryBuilder('entity')
        .insert()
        .values(createDto)
        .execute();
    }
    return result;
  }

  async _findAll(options?: IFindAllOptions<T>): Promise<T[]> {
    const find = options?.options ?? {};
    if (options?.transaction) {
      find.transaction = true;
    }
    if (options?.withDeleted) {
      find.withDeleted = true;
    }
    const relations = this.getRelations(options?.relations);
    if (relations) {
      find.relations = relations;
    }
    if (options?.entityManager) {
      return await options.entityManager.find(this._entityRepo.target, find);
    }
    return await this._entityRepo.find(options?.options);
  }

  async _findCount(options?: IFindAllOptions<T>): Promise<number> {
    const find = options?.options ?? {};
    if (options?.transaction) {
      find.transaction = true;
    }
    if (options?.withDeleted) {
      find.withDeleted = true;
    }
    const relations = this.getRelations(options?.relations);
    if (relations) {
      find.relations = relations;
    }
    if (options?.entityManager) {
      return await options.entityManager.count(this._entityRepo.target, find);
    }
    return await this._entityRepo.count(options?.options);
  }

  async _findOne(options: IFindOneOptions<T>): Promise<T | null> {
    const find = options?.options ?? {};
    if (options?.transaction) {
      find.transaction = true;
    }
    if (options?.withDeleted) {
      find.withDeleted = true;
    }
    const relations = this.getRelations(options?.relations);
    if (relations) {
      find.relations = relations;
    }
    if (options?.entityManager) {
      return await options.entityManager.findOne(this._entityRepo.target, find);
    }
    return await this._entityRepo.findOne(find);
  }

  async _findOneById(
    id: number,
    options?: IFindOneOptions<T>,
  ): Promise<T | null> {
    const find: any = options?.options ?? {};
    if (options?.transaction) {
      find.transaction = true;
    }
    if (options?.withDeleted) {
      find.withDeleted = true;
    }
    const relations = this.getRelations(options?.relations);
    if (relations) {
      find.relations = relations;
    }
    find.where = {};
    find.where['id'] = id;
    if (options?.entityManager) {
      return await options.entityManager.findOne(this._entityRepo.target, find);
    }
    return await this._entityRepo.findOne(find);
  }

  getRelations(
    option?: boolean | FindOptionsRelations<T>,
  ): FindOptionsRelations<T> | null {
    if (option) {
      if (typeof option === 'boolean') {
        return this._relations ?? null;
      } else {
        return option;
      }
    }
    return null;
  }

  getPaginationInfo(
    limit: number,
    page: number,
    totalItem: number,
  ): IPaginationMeta {
    const _pagination: IPaginationMeta = {
      total: totalItem,
      limit: limit,
      page: page,
      totalPage: 0,
    };
    _pagination.totalPage = Math.ceil(_pagination.total / limit);
    _pagination.nextPage =
      _pagination.page + 1 > _pagination.totalPage
        ? null
        : _pagination.page + 1;
    _pagination.prevPage =
      _pagination.page - 1 === 0 ? null : _pagination.page - 1;
    return _pagination;
  }

  getQueryForJsonB(splittedColumn: string[]): string {
    const removedFirstElement = [...splittedColumn];
    removedFirstElement.shift();
    const jsonQuery: string = removedFirstElement.reduce((acc, next, index) => {
      if (index === removedFirstElement.length - 1) {
        acc += ` ->> '${next}'`;
      } else {
        acc += ` -> '${next}'`;
      }
      return acc;
    }, '');
    return jsonQuery;
  }

  getTakeSkip(limit: number, page: number): { take: number; skip: number } {
    return {
      take: limit,
      skip: (page - 1) * limit,
    };
  }

  /**
   * Asynchronously retrieves paginated data from the specified table with optional filtering, sorting, and pagination.
   * @param options An optional object containing options for pagination, filtering, sorting, etc.
   * @returns A Promise resolving to an object containing the paginated data and pagination metadata.
   */
  async _paginateFind(options?: IPaginateFindOption<T>): Promise<{
    data: T[]; // The array of retrieved data objects.
    _pagination: IPaginationMeta; // Metadata regarding pagination, such as total number of records, current page, etc.
  }> {
    let find: FindManyOptions = {
      // Sorting options based on specified parameters or defaults.
      ...options?.options,
    };

    // Default Sorting
    if (options?.defaultSortColumn) {
      find.order = {
        [options.defaultSortColumn]:
          options.sortOrder ?? options.defaultSortOrder ?? 'DESC',
      };
    }

    // Sorting
    if (
      options?.sortBy &&
      options?.sortableColumns &&
      options?.sortableColumns?.includes(options?.sortBy as keyof T & string)
    ) {
      // Apply sorting based on specified column and order.
      find.order = {
        [options.sortBy]: options.sortOrder,
      };
    }

    // Searching
    if (
      (options?.searchBy ||
        (options?.defaultSearchColumns &&
          options?.defaultSearchColumns?.length &&
          options?.defaultSearchColumns?.length > 0)) &&
      options.search &&
      options?.searchableColumns &&
      Array.isArray(options?.searchableColumns) &&
      options.searchableColumns.length > 0
    ) {
      // Constructing search conditions for each searchable column.
      const columns: (keyof T | string)[] = options?.searchBy
        ? (options.searchBy.split(',') as (keyof T)[])
        : options.defaultSearchColumns || [];

      const searchWhere = columns
        ?.filter((s) =>
          options.searchableColumns?.includes(s as keyof T & string),
        )
        ?.map((s) => {
          // Handling nested JSONB columns.
          const splittedColumn: string[] = (s as string)?.split('.') ?? [];
          if (splittedColumn?.length > 1) {
            const jsonQuery: string = this.getQueryForJsonB(splittedColumn);
            const columnName = splittedColumn[0];
            return {
              [columnName]: Raw(
                (alias) => `${alias}${jsonQuery} ILIKE :name_${columnName}`,
                {
                  [`name_${columnName}`]: `%${options.search}%`,
                },
              ),
            };
          } else if ((s as string).startsWith('@@')) {
            // handle full text search
            const columnName = (s as string).replace('@@', '');
            return {
              [columnName]: Raw(
                (alias) =>
                  `${alias} @@ to_tsquery('english', :name_${columnName})`,
                {
                  [`name_${columnName}`]: this.formatPrefixQueryForTsQuery(
                    options.search ?? '',
                  ),
                },
              ),
            };
          } else {
            return { [s]: ILike(`%${options.search}%`) };
          }
        });

      // Applying search conditions to the 'find' object.
      if (find.where) {
        if (Array.isArray(find.where)) {
          console.log('Warning: Do not use array in where');
        } else {
          const oldWhere = { ...find.where };
          if (Array.isArray(searchWhere) && searchWhere.length > 0) {
            find.where = searchWhere.map((d) => ({ ...d, ...oldWhere }));
          }
        }
      } else {
        find.where = searchWhere;
      }
    }

    // Pagination
    if (options?.canSkipPagination && options?.skipPagination) {
      // Skipping pagination and returning all records.
      const _pagination = {
        total: 0,
        limit: 0,
        page: 0,
        totalPage: 0,
        skipPagination: true,
      };
      let data: T[];
      if (options?.entityManager) {
        data = await options.entityManager.find(this._entityRepo.target, find);
      } else {
        data = await this._entityRepo.find(options?.options);
      }
      return { data, _pagination };
    } else {
      // Applying pagination to the query.
      const limit = options?.limit ?? 20;
      const page = options?.page ?? 1;
      if (options?.transaction) {
        find.transaction = true;
      }
      if (options?.withDeleted) {
        find.withDeleted = true;
      }
      const relations = this.getRelations(options?.relations);
      if (relations) {
        find.relations = relations;
      }
      find = { ...find, ...this.getTakeSkip(limit, page) };

      let _pagination: IPaginationMeta = {
        total: 0,
        limit: 0,
        page: 0,
        totalPage: 0,
        nextPage: null,
        prevPage: null,
      };
      let data: T[];
      if (options?.entityManager) {
        // Retrieve paginated data and total count using EntityManager.
        const [result, count] = await options.entityManager.findAndCount(
          this._entityRepo.target,
          find,
        );
        data = result;
        _pagination.total = count;
      } else {
        // Retrieve paginated data and total count using Repository.
        const [result, count] = await this._entityRepo.findAndCount(find);
        data = result;
        _pagination.total = count;
      }

      // Calculate pagination metadata.
      _pagination = this.getPaginationInfo(limit, page, _pagination.total ?? 0);

      return { data, _pagination };
    }
  }

  formatPrefixQueryForTsQuery(input: string): string {
    // Split the input into individual words
    const words = input.trim().split(/\s+/);
    // Map each word to add ":*" and join with " & "
    const tsquery = words.map((word) => word + ':*').join(' & ');
    return tsquery;
  }

  async _paginatedQueryBuilder(
    options: IPaginateQueryBuilderOption,
  ): Promise<Result> {
    const {
      page = 1,
      limit = 20,
      sortBy,
      sortOrder,
      search,
      searchBy,
      queryBuilder,
      searchableColumns,
      sortableColumns,
      defaultSearchColumns = [],
      skipPagination = false,
      canSkipPagination = false,
      defaultSortOrder = 'DESC',
      defaultSortColumn,
    } = options;
    const builderName = queryBuilder.alias;
    // Apply default sorting
    if (defaultSortColumn) {
      const columnName = `${builderName}.${defaultSortColumn as string}`;
      queryBuilder.orderBy(columnName, sortOrder ?? defaultSortOrder ?? 'DESC');
    }

    // Apply sorting
    if (
      sortBy &&
      sortableColumns &&
      sortableColumns?.length > 0 &&
      sortableColumns.includes(sortBy)
    ) {
      const columnName = `${builderName}.${sortBy}`;
      queryBuilder.orderBy(columnName, sortOrder ?? defaultSortOrder ?? 'DESC');
    }

    // Apply searching
    if (
      search &&
      (searchBy || defaultSearchColumns.length > 0) &&
      searchableColumns
    ) {
      const columns: string[] = options?.searchBy
        ? options.searchBy.split(',')
        : (options.defaultSearchColumns as string[]) || [];

      const filteredSearchName = columns
        ?.filter((s) => options.searchableColumns?.includes(s))
        ?.map((s) => builderName + '.' + s);

      if (filteredSearchName?.length > 0) {
        queryBuilder.andWhere(
          new Brackets((qb) => {
            for (const key of filteredSearchName) {
              const splittedColumn: string[] =
                (key as string)?.split('.') ?? [];

              if (splittedColumn.length > 2) {
                // handle json search
                const jsonQuery = this.getQueryForJsonB(splittedColumn);
                qb.orWhere(
                  `${builderName}.${splittedColumn[1]}${jsonQuery} ILIKE :search`,
                  {
                    search: `%${search}%`,
                  },
                );
              } else if (
                (key as string).replace(`${builderName}.`, '').startsWith('@@')
              ) {
                const columnName = (key as string).replace('@@', '');
                // handle full text search
                qb.orWhere(
                  `${columnName} @@ to_tsquery('english', :name_${columnName})`,
                  {
                    [`name_${columnName}`]: this.formatPrefixQueryForTsQuery(
                      search ?? '',
                    ),
                  },
                );
              } else {
                qb.orWhere(`${key} ILIKE :search`, {
                  search: `%${search}%`,
                });
              }
            }
          }),
        );
      }
    }

    if (canSkipPagination && skipPagination) {
      const _pagination = {
        total: 0,
        limit: 0,
        page: 0,
        totalPage: 0,
        skipPagination: true,
      };
      const data: T[] = await queryBuilder.getMany();

      return { data, _pagination };
    } else {
      // Calculate pagination values
      const currentPage = Number(page) || 1;

      // Apply pagination
      const offset = (currentPage - 1) * limit;
      queryBuilder.skip(offset).take(limit);

      // Fetch data
      const [items, totalItems] = await queryBuilder.getManyAndCount();

      // Build result object
      const result: Result = {
        data: items,
        _pagination: this.getPaginationInfo(limit, page, totalItems),
      };

      return result;
    }
  }

  async _updateRaw(
    updateDto: QueryDeepPartialEntity<T>,
    options: IUpdateRawOptions<T>,
  ): Promise<UpdateResult> {
    if (options?.entityManager) {
      return await options.entityManager.update(
        this._entityRepo.target,
        options.where,
        updateDto,
      );
    }
    return await this._entityRepo.update(options.where, updateDto);
  }
  async _update(repo: T, options?: IUpdateOptions<T>): Promise<T> {
    if (options?.entityManager) {
      return await options.entityManager.save(this._entityRepo.target, repo);
    }
    return await this._entityRepo.save(repo);
  }

  async _softDelete(repo: T, options?: IUpdateOptions<T>): Promise<T> {
    repo.deletedAt = new Date();
    if (options?.entityManager) {
      return await options.entityManager.save(this._entityRepo.target, repo);
    }
    return await this._entityRepo.save(repo);
  }

  async _delete(repo: T, options?: IUpdateOptions<T>): Promise<T> {
    const returnRepo = { ...repo };
    if (options?.entityManager) {
      return await options.entityManager.remove(this._entityRepo.target, repo);
    }
    await this._entityRepo.remove(repo);
    return returnRepo;
  }

  async _deleteRaw(options: IDeleteRawOptions<T>): Promise<DeleteResult> {
    if (options?.entityManager) {
      return await options.entityManager.delete(
        this._entityRepo.target,
        options.where,
      );
    }
    return await this._entityRepo.delete(options.where);
  }

  async _softDeleteRaw(options: IUpdateRawOptions<T>): Promise<UpdateResult> {
    if (options?.entityManager) {
      return await options.entityManager.softDelete(
        this._entityRepo.target,
        options.where,
      );
    }
    return await this._entityRepo.softDelete(options.where);
  }

  async _restoreRaw(options: IUpdateRawOptions<T>): Promise<UpdateResult> {
    if (options?.entityManager) {
      return await options.entityManager.restore(
        this._entityRepo.target,
        options.where,
      );
    }
    return await this._entityRepo.restore(options.where);
  }

  async _query(
    query: string,
    parameters?: any[],
    options?: { entityManager: EntityManager },
  ): Promise<T> {
    if (options?.entityManager) {
      return await options.entityManager.query(query, parameters);
    }
    return this._entityRepo.query(query, parameters);
  }
}
