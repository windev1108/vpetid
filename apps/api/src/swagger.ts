import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const SWAGGER_PATH = 'docs';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('VPetId API')
    .setDescription('REST API VPetId — auth (OTP, Google, JWT), session, fraud.')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Access token (Authorization: Bearer <token>)',
        in: 'header',
      },
      'access-token',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Admin JWT (Authorization: Bearer <token>)',
        in: 'header',
      },
      'admin-access-token',
    )
    .addTag('app', 'Root & health')
    .addTag('auth', 'OTP, Google, JWT, refresh')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (_controllerKey: string, methodKey: string) => methodKey,
  });

  SwaggerModule.setup(SWAGGER_PATH, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
    },
    customSiteTitle: 'VPetId API — Swagger',
  });
}

export const swaggerDocsPath = `/${SWAGGER_PATH}`;
