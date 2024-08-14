import { Module } from '@nestjs/common';
import { RouterModule as NestJsRouterModule } from '@nestjs/core';
import { AuthenticationModule } from 'src/modules/authentication/authentication.module';
import { AdminRouterModule } from './routes/admin.router.module';
import { UserRouterModule } from './routes/user.router.module';

@Module({
  imports: [
    AdminRouterModule,
    AuthenticationModule,
    UserRouterModule,
    NestJsRouterModule.register([
      {
        path: 'admin',
        module: AdminRouterModule,
      },
      {
        path: '',
        module: UserRouterModule,
      },
    ]),
  ],
})
export class RouterModule {}
