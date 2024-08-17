import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CustomIsEnum } from 'src/common/request/validators/custom-validator';
import { USER_ROLE } from 'src/modules/user/entities/user.entity';

export class UserTypeDto {
  @ApiPropertyOptional({ enum: USER_ROLE, required: false })
  @IsOptional()
  @CustomIsEnum(USER_ROLE)
  role?: USER_ROLE;
}
