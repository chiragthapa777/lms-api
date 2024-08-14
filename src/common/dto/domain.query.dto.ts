import { ApiProperty } from '@nestjs/swagger';
import { DOMAIN } from '../constants/domain.constant';
import {
  CustomIsEnum,
  CustomIsOptional,
} from '../request/validators/custom-validator';

export class DomainQueryDto {
  @ApiProperty({
    enum: DOMAIN,
    required: false,
  })
  @CustomIsOptional()
  @CustomIsEnum(DOMAIN)
  domain: DOMAIN;
}
