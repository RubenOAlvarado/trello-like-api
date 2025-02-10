import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from 'src/app.module';
import {
  OPEN_API_TITLE,
  OPEN_API_DESCRIPTION,
  OPEN_API_VERSION,
  OPEN_API_PATH,
} from '../configs/open-api.configs';

export const buildSwaggerModule = async (
  appCore?: INestApplication,
): Promise<void> => {
  const scopedApplicationCore =
    appCore || (await NestFactory.create(AppModule));

  const options = new DocumentBuilder()
    .setTitle(OPEN_API_TITLE)
    .setDescription(OPEN_API_DESCRIPTION)
    .setVersion(OPEN_API_VERSION)
    .build();

  const document = SwaggerModule.createDocument(
    scopedApplicationCore,
    options,
    {
      include: [],
    },
  );

  SwaggerModule.setup(OPEN_API_PATH, scopedApplicationCore, document);
};
