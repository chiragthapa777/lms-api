import { SetMetadata, applyDecorators } from '@nestjs/common';

export function ResponseMessage(message: string): MethodDecorator {
  return applyDecorators(SetMetadata('responseMessage', message));
}
