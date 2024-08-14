import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { SentryModule } from '../sentry/sentry.module';
import { ErrorFilter } from './filters/error.filter';

@Module({
  imports: [SentryModule],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
  ],
})
export class ErrorModule {}
