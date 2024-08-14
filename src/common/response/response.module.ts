import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseDefaultInterceptor } from './interceptors/response.interceptor';
import { ResponseMiddlewareModule } from './middleware/response.middleware.module';

@Module({
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseDefaultInterceptor,
    },
  ],
  imports: [ResponseMiddlewareModule],
})
export class ResponseModule {}
