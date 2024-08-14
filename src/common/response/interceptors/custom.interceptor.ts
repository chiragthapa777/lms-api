import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ExcludeNullInterceptorOptions {
  fields?: string[];
}

@Injectable()
export class ExcludeNullInterceptor implements NestInterceptor {
  constructor(private readonly options?: ExcludeNullInterceptorOptions) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (this.options?.fields && this.options.fields.length > 0) {
          return this.filterFields(data.data, this.options.fields);
        }
        return {
          data: {
            id: data.data.id,
          },
        };
      }),
    );
  }

  private filterFields(data: any, fields: string[]): any {
    const filtered = {};
    fields.forEach((field) => {
      if (field) {
        if (data[field] !== undefined) {
          filtered[field] = data[field];
        }
      } else {
        filtered['id'] = data.id;
      }
    });
    return { data: filtered };
  }
}
