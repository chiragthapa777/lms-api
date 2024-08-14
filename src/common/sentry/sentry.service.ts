import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/node';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

@Injectable()
export class SentryService {
  dsn?: string;
  constructor(private readonly configService: ConfigService) {
    this.dsn = this.configService.get('SENTRY_DSN');
    if (this.dsn) {
      Sentry.init({
        dsn: this.dsn,
        integrations: [nodeProfilingIntegration()],
        tracesSampleRate: 1.0,
        profilesSampleRate: 1.0,
        environment: this.configService.get('app.env'),
      });
      console.log('Sentry initialized');
    }
  }

  captureException(error: any | Error) {
    if (this.dsn) {
      Sentry.captureException(error);
    }
  }

  captureMessage(message: any, level?: Sentry.SeverityLevel) {
    if (this.dsn) {
      Sentry.captureMessage(message, level);
    }
  }
}
