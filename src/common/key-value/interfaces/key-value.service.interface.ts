import { IGetKeyData, ISetKeyOptions } from './key-value.interface';

export interface IKeyValueService {
  get(key: string): Promise<string | null | undefined>;

  set(
    key: string,
    value: number | string,
    options?: ISetKeyOptions,
  ): Promise<void>;

  increment(key: string, by?: number): Promise<number>;

  decrement(key: string, by?: number): Promise<number>;

  keyExists(key: string): Promise<boolean>;

  generateKey(data: IGetKeyData): string;
}
