import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { ChatsModule } from './chats/chats.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MessagesModule } from './messages/messages.module';
import { RedisModule } from './redis/redis.module';
import { AdminModule } from './admin/admin.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

const configService = new ConfigService();
@Module({
  imports: [
    // ServeStaticModule.forRoot({
    //   rootPath: join(process.cwd(), 'uploads'),
    //   serveRoot: '/uploads',
    // }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: configService.get('DOCKER_MYSQL_HOST'),
      port: configService.get<number>('DOCKER_MYSQL_PORT'),
      database: configService.get('DOCKER_MYSQL_DATABASE'),
      username: configService.get('DOCKER_MYSQL_USERNAME'),
      password: configService.get('DOCKER_MYSQL_PASSWORD'),
      autoLoadEntities: true,
      synchronize: true,
    }),
    CommonModule,
    AuthModule,
    UsersModule,
    ProfilesModule,
    ChatsModule,
    MessagesModule,
    RedisModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
