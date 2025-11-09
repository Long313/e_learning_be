import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Use global ValidationPipe
  app.useGlobalPipes(new ValidationPipe());

  app.use(cookieParser())

  // --- Swagger configuration ---
  const config = new DocumentBuilder()
    .setTitle('My NestJS API')
    .setDescription('Tài liệu API được tạo tự động bằng Swagger')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Nhập JWT token vào ô dưới đây',
        in: 'header',
      },
      'JWT-auth'
    ) // Nếu dùng JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true }, // Giữ token khi reload
  });
  console.log('DB CONFIG:', {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USERNAME,
    db: process.env.DB_DATABASE,
  });
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = ['http://localhost:3000', 'http://localhost:4000'];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // cho phép
      } else {
        callback(new Error('Not allowed by CORS')); // từ chối
      }
    },
    credentials: true, // nếu có dùng cookie hoặc auth headers
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  });
  await app.listen(process.env.PORT ?? 4000);
  console.log(`🚀 Server đang chạy tại: http://localhost:${process.env.PORT ?? 4000}`);
  console.log(`📘 Swagger docs: http://localhost:${process.env.PORT ?? 4000}/api/docs`);
}

bootstrap();
