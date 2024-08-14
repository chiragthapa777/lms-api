import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { Reflector } from '@nestjs/core';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import IRequest from 'src/common/request/interfaces/request.interface';
import {
  IPaginationMeta,
  IResponse,
  IResponsePaging,
} from '../interfaces/response.interface';

@Injectable()
export class ResponseDefaultInterceptor<T>
  implements NestInterceptor<Promise<T>>
{
  constructor(private readonly reflector: Reflector) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<Promise<any>>> {
    if (context.getType() === 'http') {
      return next.handle().pipe(
        map(async (res: Promise<Record<string, any>>) => {
          const ctx: HttpArgumentsHost = context.switchToHttp();
          const response: Response = ctx.getResponse();
          const request: IRequest = ctx.getRequest<IRequest>();

          let messagePath: string = this.reflector.get<string>(
            'responseMessage',
            context.getHandler(),
          );

          // metadata
          //   const __customLang = request.__customLang;
          const __path = request.path;

          // set default response
          let httpStatus: HttpStatus = response.statusCode;
          let statusCode: number = response.statusCode;
          let data: any = undefined;
          let _pagination: IPaginationMeta | undefined = undefined;
          let metadata: any = {
            //   languages: __customLang,
            path: __path,
          };

          // response
          const responseData: IResponse | IResponsePaging = await res;

          if (responseData) {
            const { _metadata } = responseData;
            _pagination = (responseData as IResponsePaging)?._pagination;
            data = responseData.data;

            httpStatus = _metadata?.customProperty?.httpStatus ?? httpStatus;
            statusCode = _metadata?.customProperty?.statusCode ?? statusCode;
            messagePath = _metadata?.customProperty?.message ?? messagePath;
            // messageProperties =
            //   _metadata?.customProperty?.messageProperties ?? messageProperties;

            delete _metadata?.customProperty;

            metadata = {
              ...metadata,
            };
          }

          response.status(httpStatus);

          return {
            statusCode,
            message: messagePath,
            _metadata: metadata,
            data,
            _pagination,
          };
        }),
      );
    }

    return next.handle();
  }
}
