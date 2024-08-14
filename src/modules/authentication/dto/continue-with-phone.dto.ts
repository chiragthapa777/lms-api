import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  ValidateIf,
} from 'class-validator';
import {
  CustomIsEnum,
  CustomMaxLength,
  CustomMinLength,
} from 'src/common/request/validators/custom-validator';
import { CONTINUE_WITH_PHONE_ENUM } from '../constants/auth.constants';

export class ContinueWithPhoneDto {
  @ApiProperty({
    required: true,
    type: 'string',
    example: '9811338572',
  })
  @IsNotEmpty()
  @IsNumberString({}, { message: 'Phone must be number' })
  @IsString()
  @CustomMinLength(10)
  @CustomMaxLength(10)
  phone: string;
}
export class VerifyOtpDto {
  @ApiProperty({
    required: true,
    type: 'string',
    example: '9811338572',
  })
  @ValidateIf((v) => !v.email)
  @IsNotEmpty()
  @IsString()
  @CustomMinLength(10)
  @CustomMaxLength(10)
  @IsNumberString({}, { message: 'Phone must be number' })
  phone?: string;

  @ApiProperty({
    required: true,
    type: 'string',
    // example: 'admin@gmail.com',
  })
  @ValidateIf((v) => !v.phone)
  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @ApiProperty({
    required: true,
    type: 'string',
    example: '123456',
  })
  @IsNotEmpty()
  @IsString()
  otp: string;

  @ApiProperty({
    required: true,
    enum: CONTINUE_WITH_PHONE_ENUM,
    example: CONTINUE_WITH_PHONE_ENUM.LOGIN,
  })
  @CustomIsEnum(CONTINUE_WITH_PHONE_ENUM)
  @IsNotEmpty()
  @IsString()
  otpType: CONTINUE_WITH_PHONE_ENUM;
}
