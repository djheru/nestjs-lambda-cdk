import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { moduleDocumentation } from './swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  moduleDocumentation(
    app,
    'SLS-NestJS',
    'Example API using NestJS, Serverless Framework, and DynamoDB',
  );

  await app.listen(3000);
}
bootstrap();
