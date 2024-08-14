import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { RequestParamRawGuard } from '../guards/request.param.guard';
import { REQUEST_PARAM_CLASS_DTOS_META_KEY } from '../request.constant';

export function RequestParamGuard(
  ...classValidation: ClassConstructor<any>[]
): MethodDecorator {
  return applyDecorators(
    UseGuards(RequestParamRawGuard),
    SetMetadata(REQUEST_PARAM_CLASS_DTOS_META_KEY, classValidation),
  );
}
