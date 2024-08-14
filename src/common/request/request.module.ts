import {
  HttpStatus,
  Module,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import {
  ThrottlerGuard,
  ThrottlerModule,
  ThrottlerModuleOptions,
} from '@nestjs/throttler';
import { ValidationError } from 'class-validator';
import { RequestMiddlewareModule } from './middleware/request.middleware.module';

@Module({
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          transform: true,
          forbidUnknownValues: true,
          whitelist: true,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          exceptionFactory: async (errors: ValidationError[]) =>
            new UnprocessableEntityException({
              statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
              message: 'Data validation failed',
              errors,
            }),
        }),
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
  imports: [
    RequestMiddlewareModule,
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (): ThrottlerModuleOptions => ({
        throttlers: [
          {
            ttl: 1000, //1s
            limit: 10,
          },
        ],
      }),
    }),
  ],
})
export class RequestModule {}
