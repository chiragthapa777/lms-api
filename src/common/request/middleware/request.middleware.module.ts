import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RequestTimestampMiddleware } from './version/request.timestamp.middleware';
import { RequestTimezoneMiddleware } from './timezone/request.timezone.middleware';

@Module({})
export class RequestMiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(
        RequestTimestampMiddleware,
        RequestTimezoneMiddleware,
        RequestTimestampMiddleware,
      )
      .forRoutes('*');
  }
}
