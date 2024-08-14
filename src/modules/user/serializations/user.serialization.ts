import { ApiProperty } from '@nestjs/swagger';
import {
  ResponseDefaultSerialization,
  ResponsePaginationDefaultSerialization,
} from 'src/common/doc/serializations/response.default.serialization';
import { UserEntity } from '../entities/user.entity';

export class UserSerialization extends ResponseDefaultSerialization {
  @ApiProperty({
    type: UserEntity,
  })
  data: UserEntity;
}

export class UserPaginationSerialization extends ResponsePaginationDefaultSerialization {
  @ApiProperty({
    type: [UserEntity],
  })
  data: UserEntity;
}
