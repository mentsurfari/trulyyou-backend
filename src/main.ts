
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Add a global prefix to all routes (e.g., /api/auth/login)
  app.setGlobalPrefix('api');
  
  // This explicit CORS configuration is the fix for the "Network Error".
  // It uses a regular expression to specifically allow requests from any
  // localhost port, which is required by browsers for credentialed requests
  // during local development.
  const corsOptions = {
    origin: /http:\/\/localhost:\d+$/, // Regex to allow any localhost port
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  };
  
  app.enableCors(corsOptions);

  // Use global validation pipe for DTO validation
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
