import { PartialType, PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
export class UpdateUserProfileDto extends PartialType(
  PickType(CreateUserDto, ['name', 'avatar'] as const),
) {}

export class UpdateUserDto extends PartialType(
  PickType(CreateUserDto, ['name', 'avatar'] as const),
) {}
