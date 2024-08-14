import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import {
  CustomIsString,
  CustomMatches,
  CustomMaxLength,
  CustomMinLength,
} from 'src/common/request/validators/custom-validator';

export class ChangePasswordDto {
  @ApiProperty({
    required: false,
    example: 'Test@123',
  })
  @CustomIsString()
  @CustomMinLength(8)
  @CustomMaxLength(20)
  @CustomMatches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#)',
    },
  )
  password: string;

  @ApiProperty({
    required: false,
    example: faker.internet.userName(),
  })
  @CustomIsString()
  @CustomMinLength(1)
  oldPassword: string;
}

export class SetPasswordDto {
  @ApiProperty({
    required: false,
    example: 'Test@123',
  })
  @CustomIsString()
  @CustomMinLength(8)
  @CustomMaxLength(20)
  @CustomMatches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&#)',
    },
  )
  password: string;
}
