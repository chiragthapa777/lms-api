import {
  ExecutionContext,
  UseGuards,
  applyDecorators,
  createParamDecorator,
} from '@nestjs/common';
import IRequest from 'src/common/request/interfaces/request.interface';
import { UserPutToRequestGuard } from 'src/modules/authentication/guards/user-put-to-request.guard';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import {
  AuthJwtAccessGuard,
  AuthJwtExtractUser,
} from '../guards/jwt-access/auth.jwt-access.guard';

export function UserProtected(options?: {
  isRefresh?: boolean;
  addRole?: boolean;
}): MethodDecorator {
  const decorators: any[] = [AuthJwtAccessGuard, UserPutToRequestGuard];
  return applyDecorators(UseGuards(...decorators));
}
export function UserExtract(): MethodDecorator {
  const decorators: any[] = [AuthJwtExtractUser];
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
