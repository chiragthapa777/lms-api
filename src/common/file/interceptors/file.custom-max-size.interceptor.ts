import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';
import { FILE_CUSTOM_MAX_SIZE_META_KEY } from '../constants/file.constant';

@Injectable()
export class FileCustomMaxSizeInterceptor implements NestInterceptor<any> {
  constructor(private readonly reflector: Reflector) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<void>> {
    if (context.getType() === 'http') {
      const ctx: HttpArgumentsHost = context.switchToHttp();
      const request = ctx.getRequest();

      const customSize: string = this.reflector.get<string>(
        FILE_CUSTOM_MAX_SIZE_META_KEY,
        context.getHandler(),
      );
      request.__customMaxFileSize = customSize;

      return next.handle();
    }

    return next.handle();
  }
}
