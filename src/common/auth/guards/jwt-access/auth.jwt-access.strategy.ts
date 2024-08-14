import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class AuthJwtAccessStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      jsonWebTokenOptions: {
        ignoreNotBefore: false,
      },
      secretOrKey: configService.get<string>('auth.accessToken.secretKey'),
    });
  }

  async validate(data: any) {
    return data;
  }
}
