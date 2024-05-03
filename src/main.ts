import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/exeption-filter/http.exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: true,
    credentials: true,
    exposedHeaders: ['Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 요청 데이터를 해당 타입으로 변환
      whitelist: true, // 요청 데이터의 타입을 검사
      forbidNonWhitelisted: true, // 요청 데이터의 타입을 검사
      transformOptions: {
        enableImplicitConversion: true, // DTO에 ClassValidator로 정의된 타입으로 자동 변환
      },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(3000);
}
bootstrap();
