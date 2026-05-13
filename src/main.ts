import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/envs';
import { logger } from './config/logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(logger);
  app.setGlobalPrefix('api');
  app.enableCors();
  await app.listen(envs.PORT);
}
bootstrap();
