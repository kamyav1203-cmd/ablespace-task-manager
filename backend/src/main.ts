import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Set global API prefix
  app.setGlobalPrefix('api');

  // Enable CORS
  app.enableCors({
    origin: '*', // For development, allow all. In production we can scope it.
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true, // Auto transform payloads to DTO instances
    }),
  );

  const port = process.env.PORT ?? 3001; // Change to 3001 to not conflict with Next.js default (3000)
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}/api`);
}
bootstrap();
