import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ENUM_APP_ENVIRONMENT } from '../constants/app.constant';
import { SentryService } from '../sentry/sentry.service';

@Injectable()
export class DebuggerService {
  env: ENUM_APP_ENVIRONMENT;
  constructor(
    private readonly sentryService: SentryService,
    private readonly configService: ConfigService,
  ) {
    this.env = this.configService.get<ENUM_APP_ENVIRONMENT>(
      'app.env',
      ENUM_APP_ENVIRONMENT.DEVELOPMENT,
    );
  }

  log(...data: any[]) {
    if (this.env !== ENUM_APP_ENVIRONMENT.PRODUCTION) {
      console.log(...data);
    }
  }

  info(data: any) {
    this.log(data);
    this.sentryService.captureMessage(data, 'info');
  }

  warn(data: any) {
    this.log(data);
    this.sentryService.captureMessage(data, 'warning');
  }

  error(error: any | Error) {
    this.log(error);
    this.sentryService.captureException(error);
  }
}
