import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { API_BASE_PATH } from './shared/configs/api.configs';
import { buildSwaggerModule } from './shared/utils/swagger.builder.utility';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix(API_BASE_PATH);
  await buildSwaggerModule(app);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch(console.error);
