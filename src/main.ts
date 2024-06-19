import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/exeption-filter/http.exception-filter';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const PORT = process.env.PORT || 3000;

  const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:3001'],
    //origin: `${process.env.FRONT_HOST}:${process.env.FRONT_PORT || 3001}`,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization',
  };

  app.enableCors(corsOptions);

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

  // static serve
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(PORT, () => {
    console.log(`Running API in MODE: ${process.env.NODE_ENV} on PORT ${PORT}`);
  });
}
bootstrap();
