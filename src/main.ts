import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import helmet from 'helmet';

import { CorsConfig, NestConfig, SwaggerConfig } from '@/config/configuration';

import { AppModule } from './app.module';
import metadata from './metadata';

dayjs.extend(utc);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Validation
  app.useGlobalPipes(new ValidationPipe());

  // enable shutdown hook
  app.enableShutdownHooks();

  const configService = app.get(ConfigService);
  const nestConfig = configService.get<NestConfig>('nest');
  const corsConfig = configService.get<CorsConfig>('cors');
  const swaggerConfig = configService.get<SwaggerConfig>('swagger');

  // Swagger Api
  if (swaggerConfig.enabled) {
    await SwaggerModule.loadPluginMetadata(metadata);
    const options = new DocumentBuilder()
      .setTitle(swaggerConfig.title)
      .setDescription(swaggerConfig.description)
      .setVersion(swaggerConfig.version)
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);

    SwaggerModule.setup(swaggerConfig.path, app, document, {
      swaggerOptions: {
        filter: true,
        tagsSorter: 'alpha',
      },
    });
  }

  app.use(helmet());

  // Cors
  if (corsConfig.enabled) {
    app.enableCors({ origin: corsConfig.origin });
  }

  await app.listen(nestConfig.port);
}
bootstrap();
