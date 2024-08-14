import { Module } from '@nestjs/common';
import { RouterModule as NestJsRouterModule } from '@nestjs/core';
import { AuthenticationModule } from 'src/modules/authentication/authentication.module';
import { AdminRouterModule } from './routes/admin.router.module';
import { StudentRouterModule } from './routes/student.router.module';

@Module({
  imports: [
    AdminRouterModule,
    AuthenticationModule,
    StudentRouterModule,
    NestJsRouterModule.register([
      {
        path: 'admin',
        module: AdminRouterModule,
      },

      {
        path: 'student',
        module: StudentRouterModule,
      },
    ]),
  ],
})
export class RouterModule {}
