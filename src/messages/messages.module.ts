import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageModel } from './entities/messages.entity';
import { ChatModel } from 'src/chats/entities/chat.entity';
import { UserModel } from 'src/users/entities/user.entity';

@Module({
  exports: [MessagesService],
  imports: [TypeOrmModule.forFeature([MessageModel, ChatModel, UserModel])],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
