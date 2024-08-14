import { Module } from '@nestjs/common';
import { RouterModule as NestJsRouterModule } from '@nestjs/core';
import { AuthenticationModule } from 'src/modules/authentication/authentication.module';
import { AdminRouterModule } from './routes/admin.router.module';

@Module({
  imports: [
    AdminRouterModule,
    AuthenticationModule,
    NestJsRouterModule.register([
      {
        path: 'admin',
        module: AdminRouterModule,
      },
      // {
      //   path: 'customer',
      //   module: CustomerRouterModule,
      // },
    ]),
  ],
})
export class RouterModule {}
