import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ResponseTimeMiddleware } from './time/response.time.middleware';

@Module({})
export class ResponseMiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(ResponseTimeMiddleware).forRoutes('*');
  }
}
