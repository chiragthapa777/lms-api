import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class AuthJwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwtRefresh',
) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme(
        configService.get<string>('auth.prefixAuthorization', 'Bearer'),
      ),
      ignoreExpiration: false,
      jsonWebTokenOptions: {
        ignoreNotBefore: false,
      },
      secretOrKey: configService.get<string>('auth.refreshToken.secretKey'),
    });
  }

  async validate(data: any) {
    return data;
  }
}
