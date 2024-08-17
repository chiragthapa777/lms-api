import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import IRequest from 'src/common/request/interfaces/request.interface';
import { USER_ROLE } from 'src/modules/user/entities/user.entity';
import { AuthenticationService } from '../authentication.service';

@Injectable()
export class UserPutToRequestGuard implements CanActivate {
  constructor(private authService: AuthenticationService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<IRequest & { __user: any }>();

    const user: { id: number } | undefined = request?.user;
    if (!user || !user?.id) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Not Authorized!',
      });
    }
    const userFromDb = await this.authService.getUserForRequest(user.id);
    if (!userFromDb) {
      throw new UnauthorizedException({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Not Authorized!',
      });
    }
    request['__user'] = userFromDb;

    return true;
  }
}
@Injectable()
export class UserPutToRequestExtract implements CanActivate {
  constructor(private authService: AuthenticationService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<IRequest & { __user: any }>();

    const user: { id: number } | undefined = request?.user;
    if (!user || !user?.id) {
      return true;
    }
    const userFromDb = await this.authService.getUserForRequest(user.id);
    if (!userFromDb) {
      return true;
    }
    request['__user'] = userFromDb;

    return true;
  }
}
@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const role: USER_ROLE | undefined = this.reflector.get(
      'role',
      context.getHandler(),
    );
    const request = context
      .switchToHttp()
      .getRequest<IRequest & { __user: any }>();

    const user = request.__user;
    if (role) {
      const isRoleMatch = user.role === role;
      if (!isRoleMatch) {
        throw new UnauthorizedException({
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Role not authorized!',
        });
      }
    }

    return true;
  }
}
