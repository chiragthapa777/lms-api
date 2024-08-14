import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthJwtRefreshGuard extends AuthGuard('jwtRefresh') {
  handleRequest<TUser = any>(err: Error, user: TUser, info: Error): TUser {
    if (err || !user) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Invalid refresh token',
        _error: err ? err?.message : info?.message,
      });
    }

    return user;
  }
}
