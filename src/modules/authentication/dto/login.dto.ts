import { faker } from '@faker-js/faker';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import {
  CustomIsString,
  CustomMatches,
  CustomMaxLength,
  CustomMinLength,
} from 'src/common/request/validators/custom-validator';

export class LoginDto {
  @ApiProperty({
    required: true,
    example: faker.internet.email(),
  })
  @ValidateIf((v) => !v?.username && !v?.phone)
  @MinLength(1)
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({
    required: true,
    example: faker.internet.password(),
  })
  @MinLength(1)
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class RegisterDto {
  @ApiProperty({
    required: true,
    example: faker.internet.email(),
  })
  @MinLength(1)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    required: true,
  })
  @MinLength(1)
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({
    required: true,
  })
  @IsOptional()
  @IsString()
  avatar: string;

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
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)#',
    },
  )
  password: string;
}
