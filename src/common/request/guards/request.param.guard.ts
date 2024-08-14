import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { REQUEST_PARAM_CLASS_DTOS_META_KEY } from '../request.constant';

@Injectable()
export class RequestParamRawGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { params } = context.switchToHttp().getRequest();
    const classDtos: ClassConstructor<any>[] = this.reflector.get<
      ClassConstructor<any>[]
    >(REQUEST_PARAM_CLASS_DTOS_META_KEY, context.getHandler());

    for (const clsDto of classDtos) {
      const request = plainToInstance(clsDto, params);

      const errors: ValidationError[] = await validate(request);

      if (errors.length > 0) {
        throw new BadRequestException({
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          message: 'Invalid Params',
          errors: errors,
        });
      }
    }

    return true;
  }
}
