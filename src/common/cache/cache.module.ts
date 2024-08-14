import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { CustomCacheService } from './cache.service';

///no need
@Module({
  imports: [
    CacheModule.register({
      ttl: 1 * 60 * 1000,
    }),
  ],
  providers: [CustomCacheService],
  exports: [CustomCacheService],
})
export class CustomCacheModule {}
