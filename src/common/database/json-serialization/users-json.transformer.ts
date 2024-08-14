import { ValueTransformer } from 'typeorm';

export class ObjectToClassTransformer<T> implements ValueTransformer {
  constructor(private cls: new (value?: Partial<T>) => T) {} //Constructor must return an instance of type T.
  to(value: T | null | undefined): T | null | undefined {
    return value ? new this.cls(value) : value;
  }
  from(value: object | null | undefined): T | null | undefined {
    const instance = value ? new this.cls(value as Partial<T>) : value;
    return instance;
  }
}
