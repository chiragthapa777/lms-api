import { ValueTransformer } from 'typeorm';

export class ColumnNumericTransformerPipe implements ValueTransformer {
  to(data?: number | null): number | null {
    if (data !== null && data !== undefined) {
      return data;
    }
    return null;
  }

  from(data?: string | null): number | null {
    if (data !== null && data !== undefined) {
      const res = parseFloat(data);
      if (isNaN(res)) {
        return null;
      } else {
        return res;
      }
    }
    return null;
  }
}
