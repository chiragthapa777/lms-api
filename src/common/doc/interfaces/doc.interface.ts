import { Type } from '@nestjs/common';
import {
  ApiHeaderOptions,
  ApiParamOptions,
  ApiQueryOptions,
} from '@nestjs/swagger';
export enum ENUM_DOC_REQUEST_BODY_TYPE {
  JSON = 'JSON',
  FORM_DATA = 'FORM_DATA',
  TEXT = 'TEXT',
}

export interface IApiDocOption {
  operation: string;
  deprecated?: boolean;
  description?: string;
  pagination?: boolean;
  jwtAccessToken?: boolean;
  jwtRefreshToken?: boolean;
  params?: ApiParamOptions[];
  queries?: ApiQueryOptions[];
  headers?: ApiHeaderOptions[];
  bodyType?: ENUM_DOC_REQUEST_BODY_TYPE;
  serialization?: Type<unknown>;
}
