import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from 'src/users/entities/user.entity';
import { ProfileModel } from 'src/profiles/entities/profile.entity';
import { RedisModule } from 'src/redis/redis.module';
import { ChatModel } from './entities/chat.entity';
import { MessagesModule } from 'src/messages/messages.module';
import { ChatsGateway } from './chats.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserModel, ProfileModel, ChatModel]),
    RedisModule,
    MessagesModule,
  ],
  exports: [ChatsService],
  controllers: [ChatsController],
  providers: [ChatsService, ChatsGateway],
})
export class ChatsModule {}
