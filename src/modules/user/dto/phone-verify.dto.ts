import { ApiProperty } from '@nestjs/swagger';
import {
  CustomIsNotEmpty,
  CustomIsString,
} from 'src/common/request/validators/custom-validator';

export class PhoneVerifyOtpDto {
  @ApiProperty({
    required: true,
    type: 'string',
    example: '123456',
  })
  @CustomIsNotEmpty()
  @CustomIsString()
  otp: string;
}
