import { EntityManager, FindOptionsWhere } from 'typeorm';

export interface IUpdateOptions<T> {
  entityManager?: EntityManager;
  where?: FindOptionsWhere<T> | string | string[] | number | number[];
}
export interface IUpdateRawOptions<T> {
  entityManager?: EntityManager;
  where: FindOptionsWhere<T> | string | string[] | number | number[];
}
