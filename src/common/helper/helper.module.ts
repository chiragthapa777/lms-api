import { Global, Module } from '@nestjs/common';
import { HelperFileService } from './services/helper.file.service';
import { HelperDateService } from './services/helper.date.service';
import { HelperNumberService } from './services/helper.number.service';

@Global()
@Module({
  providers: [HelperFileService, HelperDateService, HelperNumberService],
  exports: [HelperFileService, HelperDateService, HelperNumberService],
})
export class HelperModule {}
