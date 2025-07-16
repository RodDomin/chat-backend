import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import express from 'express';
import path from 'path';
import { AppModule } from './app.module';

const logger = new Logger('Bootstrap Application');
Error.stackTraceLimit = Infinity;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/static', express.static(
    path.resolve(
      __dirname, '..', 'upload'
    )
  ));

  await app.listen(3333, () => logger.log('🚀 Server is running'));
}
bootstrap();
