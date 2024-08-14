import { ConfigService } from '@nestjs/config';
import { NestApplication } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fs from 'node:fs';
import path from 'node:path';
import { ENUM_APP_ENVIRONMENT } from './common/constants/app.constant';
import { AdminRouterModule } from './router/routes/admin.router.module';
import { StudentRouterModule } from './router/routes/student.router.module';

export default async function (app: NestApplication) {
  const configService = app.get(ConfigService);
  const env: string = configService.get<string>(
    'APP_ENVIRONMENT',
    ENUM_APP_ENVIRONMENT.DEVELOPMENT,
  );
  const customCss = fs.readFileSync(
    path.join(__dirname, './../swagger-theme/dark.css'),
    'utf8',
  );

  if (env !== ENUM_APP_ENVIRONMENT.PRODUCTION) {
    // for admin
    const adminDocumentBuild = new DocumentBuilder()
      .setTitle('Mero Event Admin API')
      .setDescription('Rest APIs for Mero Event Admin')
      .setVersion('1')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'accessToken',
      )
      // .addBearerAuth(
      //   { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      //   'refreshToken',
      // )
      .build();

    const adminDocument = SwaggerModule.createDocument(
      app,
      adminDocumentBuild,
      {
        deepScanRoutes: true,
        include: [AdminRouterModule],
      },
    );

    SwaggerModule.setup('/admin-docs', app, adminDocument, {
      explorer: true,
      customSiteTitle: 'Mero Event Admin',
      swaggerOptions: {
        docExpansion: 'none',
        filter: true,
        showRequestDuration: true,
        persistAuthorization: true,
      },
      customCss,
    });
    // for student
    const studentDocumentBuild = new DocumentBuilder()
      .setTitle('IMS Student API')
      .setDescription('APIs for IMS Students')
      .setVersion('1')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'accessToken',
      )
      .build();

    const studentDocument = SwaggerModule.createDocument(
      app,
      studentDocumentBuild,
      {
        deepScanRoutes: true,
        include: [StudentRouterModule],
      },
    );

    SwaggerModule.setup('/student-docs', app, studentDocument, {
      explorer: true,
      customSiteTitle: 'Mero Event Customer',
      swaggerOptions: {
        docExpansion: 'none',
        filter: true,
        showRequestDuration: true,
        persistAuthorization: true,
      },
      customCss,
    });
  }
}
