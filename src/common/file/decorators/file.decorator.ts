import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import {
  FILE_CUSTOM_MAX_FILES_META_KEY,
  FILE_CUSTOM_MAX_SIZE_META_KEY,
} from '../constants/file.constant';
import { FileCustomMaxFilesInterceptor } from '../interceptors/file.custom-max-files.interceptor';
import { FileCustomMaxSizeInterceptor } from '../interceptors/file.custom-max-size.interceptor';
import IRequest from 'src/common/request/interfaces/request.interface';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export function UploadFileSingle(field: string): MethodDecorator {
  return applyDecorators(UseInterceptors(FileInterceptor(field)));
}

export function UploadFileMultiple(
  field: string,
  maxCount?: number,
): MethodDecorator {
  return applyDecorators(
    UseInterceptors(
      FilesInterceptor(
        field,
        maxCount ?? (Number(process.env.MAX_FILE_COUNT) || 20),
      ),
    ),
  );
}

export function FileCustomMaxFile(customMaxFiles: number): MethodDecorator {
  return applyDecorators(
    UseInterceptors(FileCustomMaxFilesInterceptor),
    SetMetadata(FILE_CUSTOM_MAX_FILES_META_KEY, customMaxFiles),
  );
}

export function FileCustomMaxSize(customMaxSize: string): MethodDecorator {
  return applyDecorators(
    UseInterceptors(FileCustomMaxSizeInterceptor),
    SetMetadata(FILE_CUSTOM_MAX_SIZE_META_KEY, customMaxSize),
  );
}

export const FilePartNumber: () => ParameterDecorator = createParamDecorator(
  (data: string, ctx: ExecutionContext): number => {
    const request = ctx.switchToHttp().getRequest<IRequest>();
    const { headers } = request;
    return headers['x-part-number'] ? Number(headers['x-part-number']) : 0;
  },
);
