import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const moduleDocumentation = (
  app: INestApplication,
  title: string,
  description?: string,
  version = '1.0',
): void => {
  const options = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description || `Swagger Documentation for ${title}`)
    .setVersion(version)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);
};
