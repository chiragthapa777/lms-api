import { Global, Module } from '@nestjs/common';
import { SentryModule } from '../sentry/sentry.module';
import { DebuggerService } from './debugger.service';

@Global()
@Module({
  providers: [DebuggerService],
  exports: [DebuggerService],
  imports: [SentryModule],
})
export class DebuggerModule {}
