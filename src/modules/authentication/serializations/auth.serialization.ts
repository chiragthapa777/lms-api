import { ApiProperty } from '@nestjs/swagger';
import { ResponseDefaultSerialization } from 'src/common/doc/serializations/response.default.serialization';

export class AuthToken {
  @ApiProperty({
    type: 'string',
    example: 'accessToken',
  })
  accessToken: string;
  // @ApiProperty({
  //   type: 'string',
  //   example: 'refreshToken',
  // })
  // refreshToken: string;
}

export class AuthTokenSerialization extends ResponseDefaultSerialization {
  @ApiProperty({
    type: AuthToken,
  })
  data: AuthToken;
}
export class ForgotOtpSerialization extends ResponseDefaultSerialization {
  @ApiProperty({
    description: 'Otp',
    example: '123456',
    type: 'string',
  })
  data: string;
}
