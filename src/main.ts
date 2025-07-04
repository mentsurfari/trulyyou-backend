
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Add a global prefix to all routes (e.g., /api/auth/login)
  app.setGlobalPrefix('api');
  
  // This explicit CORS configuration allows requests from our local development
  // environment and our future deployed frontend on Vercel.
  const corsOptions = {
    origin: [/http:\/\/localhost:\d+$/, /https:\/\/.*\.vercel\.app/],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  };
  
  app.enableCors(corsOptions);

  // Use global validation pipe for DTO validation
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();