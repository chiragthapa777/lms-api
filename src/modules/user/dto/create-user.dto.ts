import { ApiProperty } from '@nestjs/swagger';
import {
  CustomIsOptional,
  CustomIsString,
  CustomMatches,
  CustomMaxLength,
  CustomMinLength,
} from 'src/common/request/validators/custom-validator';
import { IUser } from '../interfaces/user.interface';
import { USER_ROLE } from '../entities/user.entity';
import { IsOptional } from 'class-validator';

export class CreateUserDto implements IUser {
  @ApiProperty({
    example: 'Test@123',
    required: false,
  })
  @CustomIsString()
  @CustomMinLength(8)
  @CustomMaxLength(20)
  @CustomMatches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)#',
    },
  )
  password?: string | undefined;

  @ApiProperty({
    required: false,
    example: 'admin@gmail.com',
  })
  @CustomIsOptional()
  @CustomIsString()
  @CustomMinLength(1)
  email?: string | undefined;

  @ApiProperty({
    required: false,
    example: '9810338577',
    maxLength: 10,
    minLength: 10,
  })
  @CustomIsOptional()
  @CustomIsString()
  @CustomMinLength(2)
  @CustomMaxLength(1000)
  name?: string | undefined;

  @ApiProperty({
    required: false,
    example: '9810338577',
    maxLength: 10,
    minLength: 10,
  })
  @CustomIsOptional()
  @CustomIsString()
  @CustomMinLength(10)
  @CustomMaxLength(1000)
  @IsOptional()
  avatar?: string | undefined;

  role?: USER_ROLE;
}
