import {
  PipeTransform,
  Injectable,
  PayloadTooLargeException,
  Scope,
  Inject,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { REQUEST } from '@nestjs/core';
import { ENUM_FILE_STATUS_CODE_ERROR } from '../constants/file.status-code.constant';
import { HelperFileService } from 'src/common/helper/services/helper.file.service';
import { IFile } from '../interfaces/file.interface';

@Injectable({ scope: Scope.REQUEST })
export class FileSizeImagePipe implements PipeTransform {
  private readonly maxSize: number;

  constructor(
    @Inject(REQUEST)
    private readonly request: Request & { __customMaxFileSize: string },
    private readonly configService: ConfigService,
    private readonly helperFileService: HelperFileService,
  ) {
    this.maxSize = this.configService.get<number>('file.image.maxFileSize', 2);
  }

  async transform(value: IFile | IFile[]): Promise<IFile | IFile[]> {
    if (!value) {
      return [];
    }

    if (Array.isArray(value)) {
      for (const val of value) {
        await this.validate(val.size);
      }

      return value;
    }

    const file: IFile = value as IFile;
    await this.validate(file.size);

    return value;
  }

  async validate(size: number): Promise<void> {
    const maxSizeInBytes = this.request.__customMaxFileSize
      ? this.helperFileService.convertToBytes(this.request.__customMaxFileSize)
      : this.maxSize;

    if (size > maxSizeInBytes) {
      throw new PayloadTooLargeException({
        statusCode: ENUM_FILE_STATUS_CODE_ERROR.FILE_MAX_SIZE_ERROR,
        message: 'File size too big',
      });
    }

    return;
  }
}
@Injectable({ scope: Scope.REQUEST })
export class FileSizePipe implements PipeTransform {
  private readonly maxSize: number;

  constructor(
    @Inject(REQUEST)
    private readonly request: Request & { __customMaxFileSize: string },
    private readonly configService: ConfigService,
    private readonly helperFileService: HelperFileService,
  ) {
    this.maxSize = this.configService.get<number>('file.other.maxFileSize', 2);
  }

  async transform(value: IFile | IFile[]): Promise<IFile | IFile[]> {
    if (!value) {
      return [];
    }

    if (Array.isArray(value)) {
      for (const val of value) {
        await this.validate(val.size);
      }

      return value;
    }

    const file: IFile = value as IFile;
    await this.validate(file.size);

    return value;
  }

  async validate(size: number): Promise<void> {
    const maxSizeInBytes = this.request.__customMaxFileSize
      ? this.helperFileService.convertToBytes(this.request.__customMaxFileSize)
      : this.maxSize;

    if (size > maxSizeInBytes) {
      throw new PayloadTooLargeException({
        statusCode: ENUM_FILE_STATUS_CODE_ERROR.FILE_MAX_SIZE_ERROR,
        message: 'File size too big',
      });
    }

    return;
  }
}

@Injectable({ scope: Scope.REQUEST })
export class FileSizeVideoPipe implements PipeTransform {
  private readonly maxSize: number;

  constructor(
    @Inject(REQUEST)
    private readonly request: Request & { __customMaxFileSize: string },
    private readonly configService: ConfigService,
    private readonly helperFileService: HelperFileService,
  ) {
    this.maxSize = this.configService.get<number>('file.video.maxFileSize', 2);
  }

  async transform(value: IFile | IFile[]): Promise<IFile | IFile[]> {
    if (Array.isArray(value)) {
      for (const val of value) {
        await this.validate(val.size);
      }

      return value;
    }

    const file: IFile = value as IFile;
    await this.validate(file.size);

    return value;
  }

  async validate(size: number): Promise<void> {
    const maxSizeInBytes = this.request.__customMaxFileSize
      ? this.helperFileService.convertToBytes(this.request.__customMaxFileSize)
      : this.maxSize;

    if (size > maxSizeInBytes) {
      throw new PayloadTooLargeException({
        statusCode: ENUM_FILE_STATUS_CODE_ERROR.FILE_MAX_SIZE_ERROR,
        message: 'File size too big',
      });
    }

    return;
  }
}
