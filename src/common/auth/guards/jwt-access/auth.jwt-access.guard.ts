import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AuthJwtAccessGuard extends AuthGuard('jwt') {
  handleRequest(err: Error, user: { id: number }, info: Error): any {
    if (err || !user) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Not Authorized!',
        _error: err ? err?.message : info?.message,
      });
    }
    return user;
  }
}
@Injectable()
export class AuthJwtExtractUser extends AuthGuard('jwt') {
  handleRequest(err: Error, user: { id: number }): any {
    if (user) {
      return user;
    } else {
      return null;
    }
  }
}
