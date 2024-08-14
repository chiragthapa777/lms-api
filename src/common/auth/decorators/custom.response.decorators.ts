import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { ExcludeNullInterceptor } from 'src/common/response/interceptors/custom.interceptor';

export function CustomResponseDecorator(fields?: string[]): MethodDecorator {
  return applyDecorators(
    UseInterceptors(new ExcludeNullInterceptor({ fields })),
  );
}
