import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';
import { UsersModule } from 'src/users/users.module';
import { ChatsModule } from 'src/chats/chats.module';

@Module({
  imports: [UsersModule],
  exports: [RedisService],
  controllers: [RedisController],
  providers: [RedisService],
})
export class RedisModule {}
