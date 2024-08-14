import { ClassSerializerInterceptor } from '@nestjs/common';
import { NestApplication, NestFactory, Reflector } from '@nestjs/core';
import { json } from 'body-parser';
import helmet from 'helmet';
import { AppModule } from './app/app.module';
import { FilteredLogger } from './common/filteredLogger';
import swaggerInit from './swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule, {
    logger: new FilteredLogger(),
  });
  await swaggerInit(app);
  app.use(helmet());
  const configService = app.get(ConfigService);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.enableCors();
  app.use(json({ limit: '10mb' }));
  const port: number = configService.get<number>('app.http.port', 3000);
  const host: string = configService.get<string>('app.http.host', 'localhost');
  await app.listen(port, host);

  console.log(`App running on port ${port}`);
}
bootstrap();
