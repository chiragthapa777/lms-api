import {
  ExecutionContext,
  SetMetadata,
  UseGuards,
  applyDecorators,
  createParamDecorator,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import IRequest from 'src/common/request/interfaces/request.interface';
import {
  RoleGuard,
  UserPutToRequestExtract,
  UserPutToRequestGuard,
} from 'src/modules/authentication/guards/user-put-to-request.guard';
import { USER_ROLE, UserEntity } from 'src/modules/user/entities/user.entity';
import {
  AuthJwtAccessGuard,
  AuthJwtExtractUser,
} from '../guards/jwt-access/auth.jwt-access.guard';

export const Role = Reflector.createDecorator<USER_ROLE | undefined>();

export function UserProtected(options?: { role: USER_ROLE }): MethodDecorator {
  const decorators: any[] = [AuthJwtAccessGuard, UserPutToRequestGuard];
  if (options?.role) {
    decorators.push(RoleGuard);
  }
  return applyDecorators(
    SetMetadata('role', options?.role),
    UseGuards(...decorators),
  );
}

export function UserExtract(): MethodDecorator {
  const decorators: any[] = [AuthJwtExtractUser, UserPutToRequestExtract];
  return applyDecorators(UseGuards(...decorators));
}

export const GetUser = createParamDecorator(
  (returnPlain: boolean, ctx: ExecutionContext): UserEntity => {
    const req = ctx
      .switchToHttp()
      .getRequest<IRequest & { __user: UserEntity }>();
    return returnPlain ? req.__user : req.__user;
  },
);

export const AuthJwtToken = createParamDecorator(
  (data: string, ctx: ExecutionContext): string | undefined => {
    const { headers } = ctx.switchToHttp().getRequest<IRequest>();
    const { authorization } = headers;
    if (!authorization) return '';
    const authorizations: string[] = authorization.split(' ');

    return authorizations.length >= 2 ? authorizations[1] : undefined;
  },
);
