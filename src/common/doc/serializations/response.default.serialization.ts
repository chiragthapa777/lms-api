import { ApiProperty } from '@nestjs/swagger';
import { IPaginationMeta } from 'src/common/response/interfaces/response.interface';

export class ResponseMetadataSerialization {
  languages: string[];
  timestamp: number;
  timezone: string;
  requestId: string;
  path: string;
  version: string;
  repoVersion: string;
  [key: string]: any;
}

export class ResponseDefaultSerialization {
  @ApiProperty({
    name: 'statusCode',
    type: Number,
    required: true,
    nullable: false,
    description: 'return specific status code for every endpoints',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    name: 'message',
    required: true,
    nullable: false,
    oneOf: [
      {
        type: 'string',
        example: 'message endpoint',
      },
    ],
  })
  message: string;

  @ApiProperty({
    name: '_metadata',
    required: true,
    nullable: false,
    description: 'Contain metadata about API',
    type: 'object',
    example: {
      path: '/api/v1/test/hello',
    },
  })
  _metadata: ResponseMetadataSerialization;
}
export class ResponsePaginationDefaultSerialization extends ResponseDefaultSerialization {
  @ApiProperty({
    name: '_pagination',
    required: true,
    nullable: false,
    description: 'Contain metadata about API',
    type: 'object',
    example: {
      totalPage: 1,
      total: 10,
      limit: 10,
      page: 1,
    },
  })
  _pagination: IPaginationMeta;
}
