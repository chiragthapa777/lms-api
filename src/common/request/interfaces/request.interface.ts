import { HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { ResponseDefaultSerialization } from 'src/common/doc/serializations/response.default.serialization';
import {
  IErrors,
  IErrorsImport,
} from 'src/common/error/interfaces/error.interface';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { IResult } from 'ua-parser-js';

export default interface IRequest extends Request {
  __user: UserEntity;
  user?: { id: number };
  __skipRequestBodyLog?: boolean;
  __skipHttpLog?: boolean;
  __id: string;
  __xTimestamp?: number;
  __timestamp: number;
  __timezone: string;
  __customLang: string[];
  __xCustomLang: string;
  __version: string;
  __repoVersion: string;
  __userAgent: IResult;

  __class?: string;
  __function?: string;

  __filters?: Record<
    string,
    string | number | boolean | Array<string | number | boolean>
  >;
  __pagination?: ResponseDefaultSerialization;
}

export interface IRequestApp extends Request {
  __user: UserEntity;
  user?: { id: number };
  __skipRequestBodyLog?: boolean;
  __skipHttpLog?: boolean;
  __id: string;
  __xTimestamp?: number;
  __timestamp: number;
  __timezone: string;
  __customLang: string[];
  __xCustomLang: string;
  __version: string;
  __repoVersion: string;
  __userAgent: IResult;

  __class?: string;
  __function?: string;

  __filters?: Record<
    string,
    string | number | boolean | Array<string | number | boolean>
  >;
  __pagination?: ResponseDefaultSerialization;
}

export interface IResponseApp extends Response {
  responseBody: {
    statusCode: HttpStatus;
    message: string;
    _metadata?: any;
    errors?: IErrors[] | IErrorsImport[];
    _error?: string;
    data?: any;
  };
}
