import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageModel } from './entities/messages.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(MessageModel)
    private readonly messageRepository: Repository<MessageModel>,
  ) {}
  async createMessage(createMessageDto: CreateMessageDto, authorId: number) {
    const message = await this.messageRepository.save({
      Chat: {
        id: createMessageDto.chatId,
      },
      Author: {
        id: authorId,
      },
      message: createMessageDto.message,
    });

    return await this.messageRepository.findOne({
      where: {
        id: message.id,
      },
      relations: ['Author', 'Chat'],
    });
  }
}
