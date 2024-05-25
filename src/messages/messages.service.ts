import { Injectable, UseGuards, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageModel } from './entities/messages.entity';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Injectable()
@UseGuards(JwtAuthGuard)
export class MessagesService {
  constructor(
    @InjectRepository(MessageModel)
    private readonly messageRepository: Repository<MessageModel>,
  ) {}
  async createMessage(createMessageDto: CreateMessageDto, @Request() req) {
    console.log('req.user.id');
    console.log(req);
    const message = await this.messageRepository.save({
      Chat: {
        id: createMessageDto.chatId,
      },
      Author: {
        id: req.sub,
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

  async getMessages(chatId: number) {
    const messages = await this.messageRepository.find({
      where: {
        Chat: {
          id: chatId,
        },
      },
      relations: ['Author', 'Chat'],
    });
  }
}
