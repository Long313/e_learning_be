import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // --- Swagger configuration ---
  const config = new DocumentBuilder()
    .setTitle('My NestJS API')
    .setDescription('Tài liệu API được tạo tự động bằng Swagger')
    .setVersion('1.0')
    .addBearerAuth() // Nếu dùng JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: { persistAuthorization: true }, // Giữ token khi reload
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`🚀 Server đang chạy tại: http://localhost:${process.env.PORT ?? 4000}`);
  console.log(`📘 Swagger docs: http://localhost:${process.env.PORT ?? 4000}/api/docs`);
}

bootstrap();
