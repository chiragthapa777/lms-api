import { NestApplication } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import fs from 'node:fs';
import path from 'node:path';
import { AdminRouterModule } from './router/routes/admin.router.module';
import { UserRouterModule } from './router/routes/user.router.module';

export default async function (app: NestApplication) {
  const customCss = fs.readFileSync(
    path.join(__dirname, './../swagger-theme/dark.css'),
    'utf8',
  );
  // for admin
  const adminDocumentBuild = new DocumentBuilder()
    .setTitle('LMS Admin API')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'accessToken',
    )
    .build();

  const adminDocument = SwaggerModule.createDocument(app, adminDocumentBuild, {
    deepScanRoutes: true,
    include: [AdminRouterModule],
  });

  SwaggerModule.setup('/admin-docs', app, adminDocument, {
    explorer: true,
    customSiteTitle: 'LMS Admin',
    swaggerOptions: {
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
      persistAuthorization: true,
    },
    customCss,
  });

  const customerDocumentBuild = new DocumentBuilder()
    .setTitle('LMS API')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'accessToken',
    )
    .build();

  const customerDocument = SwaggerModule.createDocument(
    app,
    customerDocumentBuild,
    {
      deepScanRoutes: true,
      include: [UserRouterModule],
    },
  );

  SwaggerModule.setup('/docs', app, customerDocument, {
    explorer: true,
    customSiteTitle: 'LMS',
    swaggerOptions: {
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
      persistAuthorization: true,
    },
    customCss,
  });
}
