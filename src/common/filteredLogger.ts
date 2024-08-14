import { ConsoleLogger } from '@nestjs/common';

export class FilteredLogger extends ConsoleLogger {
  log(message: any, context?: string) {
    if (
      context !== 'RouterExplorer' &&
      context !== 'NestApplication' &&
      context !== 'InstanceLoader' &&
      context !== 'RoutesResolver' &&
      context !== 'NestFactory'
    ) {
      super.log(message, context);
    }
  }

  error(message: any, trace?: string, context?: string) {
    super.error(message, trace, context);
  }

  warn(message: any, context?: string) {
    super.warn(message, context);
  }

  debug(message: any, context?: string) {
    super.debug(message, context);
  }

  verbose(message: any, context?: string) {
    super.verbose(message, context);
  }
}
