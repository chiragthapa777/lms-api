import { HttpStatus, applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiExtraModels,
  ApiHeader,
  ApiHeaders,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import {
  ENUM_DOC_REQUEST_BODY_TYPE,
  IApiDocOption,
} from './interfaces/doc.interface';
import { ResponseDefaultSerialization } from './serializations/response.default.serialization';

export function DocDefault(options: {
  statusCode: HttpStatus;
  message: string;
  showError?: boolean;
  pagination?: boolean;
  dataType?: any;
}): MethodDecorator {
  const docs = [];
  const allOf: (SchemaObject | ReferenceObject)[] = [
    { $ref: getSchemaPath(ResponseDefaultSerialization) },
  ];
  const schema: SchemaObject & Partial<ReferenceObject> = {
    allOf,
    properties: {
      message: {
        example: options.message,
      },
      statusCode: {
        type: 'number',
        example: options.statusCode,
      },
    },
  };
  if (options?.dataType && schema.properties) {
    schema.properties.data = options.dataType;
  }
  if (!options.pagination && schema?.properties) {
    delete schema.properties?._pagination;
  }

  return applyDecorators(
    ApiExtraModels(ResponseDefaultSerialization),
    ApiResponse({
      status: options.statusCode,
      schema,
    }),
    ...docs,
  );
}

export function ApiDocs(options: IApiDocOption): MethodDecorator {
  const docs: any[] = [];

  // default jwt access token added
  if (
    options?.jwtAccessToken === undefined ||
    options.jwtAccessToken === null
  ) {
    options.jwtAccessToken = true;
  }

  if (options?.jwtRefreshToken) {
    docs.push(ApiBearerAuth('refreshToken'));
    DocDefault({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Unauthorized',
    });
  }

  if (options?.jwtAccessToken) {
    docs.push(ApiBearerAuth('accessToken'));
    DocDefault({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Unauthorized',
    });
  }

  if (options?.bodyType === ENUM_DOC_REQUEST_BODY_TYPE.FORM_DATA) {
    docs.push(ApiConsumes('multipart/form-data'));
  } else if (options?.bodyType === ENUM_DOC_REQUEST_BODY_TYPE.TEXT) {
    docs.push(ApiConsumes('text/plain'));
  } else if (options?.bodyType === ENUM_DOC_REQUEST_BODY_TYPE.JSON) {
    docs.push(ApiConsumes('application/json'));
  }

  if (options.serialization) {
    docs.push(
      ApiResponse({
        status: HttpStatus.OK,
        type: options.serialization,
      }),
    );
  }

  if (options?.params) {
    const params: MethodDecorator[] = options?.params?.map((param) =>
      ApiParam(param),
    );
    docs.push(...params);
  }

  if (options?.queries) {
    const queries: MethodDecorator[] = options?.queries?.map((query) =>
      ApiQuery(query),
    );
    docs.push(...queries);
  }

  if (options?.headers) {
    const headers: MethodDecorator[] = options?.headers?.map((header) =>
      ApiHeader(header),
    );
    docs.push(...headers);
  }

  return applyDecorators(
    ApiExtraModels(ResponseDefaultSerialization),
    ApiOperation({
      summary: options?.operation,
      deprecated: options?.deprecated,
      description: options?.description,
    }),
    ...docs,
    ApiHeaders([]),
    DocDefault({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal Server Error',
    }),
    DocDefault({
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      message: 'Data validation failed',
      showError: true,
    }),
  );
}
