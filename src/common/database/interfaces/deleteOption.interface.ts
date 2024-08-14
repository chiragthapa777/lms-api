import { EntityManager, FindOptionsWhere } from 'typeorm';

export interface IDeleteOptions<T> {
  entityManager?: EntityManager;
  where?: FindOptionsWhere<T> | string | string[] | number | number[];
}
export interface IDeleteRawOptions<T> {
  entityManager?: EntityManager;
  where: FindOptionsWhere<T> | string | string[] | number | number[];
}
