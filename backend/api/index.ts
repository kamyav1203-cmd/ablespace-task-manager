import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import express from 'express';

const server = express();
let isAppInitialized = false;
let appInstance: any = null;

async function bootstrap() {
  if (!isAppInitialized) {
    appInstance = await NestFactory.create(AppModule, new ExpressAdapter(server));
    appInstance.setGlobalPrefix('api');
    appInstance.useGlobalPipes(new ValidationPipe());
    appInstance.enableCors();
    await appInstance.init();
    isAppInitialized = true;
  }
}

// Middleware to ensure NestJS has finished bootstrapping before handling requests
server.use(async (req, res, next) => {
  try {
    await bootstrap();
    next();
  } catch (err) {
    next(err);
  }
});

export default server;
