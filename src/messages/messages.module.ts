import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageModel } from './entities/messages.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MessageModel])],
  controllers: [MessagesController],
  providers: [MessagesService],
})
export class MessagesModule {}
