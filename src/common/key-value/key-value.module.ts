import {
  DynamicModule,
  ForwardReference,
  Global,
  Module,
  Provider,
  Type,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { KeyValueCacheService } from './services/key-value.cache.service';
import { CacheModule } from '@nestjs/cache-manager';

@Global()
@Module({})
export class KeyValueModule {
  static forRoot({ useCache }: { useCache: boolean }): DynamicModule {
    const providers: Provider<any>[] = [];
    const imports: (
      | DynamicModule
      | Type<any>
      | Promise<DynamicModule>
      | ForwardReference<any>
    )[] = [];

    imports.push(ConfigModule);

    if (useCache) {
      imports.push(CacheModule.register());
      providers.push(KeyValueCacheService);
    }

    return {
      module: KeyValueModule,
      providers,
      exports: providers,
      controllers: [],
      imports: [...imports],
    };
  }
}
