import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import {
  CustomIsEnum,
  CustomIsOptional,
  CustomTransformStringToBoolean,
} from 'src/common/request/validators/custom-validator';
import { USER_TYPE } from 'src/modules/user/interfaces/user.interface';

export class UserTypeDto {
  @ApiPropertyOptional({ enum: USER_TYPE, required: false })
  @IsOptional()
  @CustomIsEnum(USER_TYPE)
  type?: USER_TYPE;

  @ApiPropertyOptional({
    enum: ['true', 'false'],
    required: false,
    description: 'if `true` then user with no vendor will be listed',
  })
  @CustomIsEnum(['true', 'false', false, true])
  @CustomIsOptional()
  @CustomTransformStringToBoolean()
  onlyVendorNotAssigned?: boolean;
}
