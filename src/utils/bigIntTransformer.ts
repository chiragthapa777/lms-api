import { ValueTransformer } from 'typeorm';

export class BigIntTransformerPipe implements ValueTransformer {
  to(data: number): number | string {
    return data;
  }

  from(data: string): number | null {
    return !isNaN(parseInt(data)) ? parseInt(data, 10) : null;
  }
}
