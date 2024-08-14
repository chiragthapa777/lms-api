import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumberString,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  CustomIsNotEmpty,
  CustomIsString,
  CustomMaxLength,
  CustomMinLength,
} from 'src/common/request/validators/custom-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    required: true,
    example: faker.phone.number(),
  })
  @CustomMinLength(10)
  @CustomIsNotEmpty()
  @CustomMinLength(10)
  @CustomMaxLength(10)
  @IsNumberString({}, { message: 'Phone must be number' })
  phone: string;
}
export class ForgotPasswordSetDto {
  @ApiProperty({
    required: true,
    example: faker.internet.password(),
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)',
    },
  )
  password: string;

  @ApiProperty({
    required: true,
    example: '123456',
  })
  @CustomMinLength(6)
  @CustomIsNotEmpty()
  @CustomIsString()
  @CustomMaxLength(6)
  otp: string;
}
