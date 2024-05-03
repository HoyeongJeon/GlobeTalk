import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { ChatsService } from './chats.service';
import { Server, Socket } from 'socket.io';
import { CreateChatDto } from './dto/create-chat.dto';
import { CreateMessageDto } from 'src/messages/dto/create-message.dto';
import { MessagesService } from 'src/messages/messages.service';
import {
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { WsBearerTokenGuard } from './guards/ws-bearer-token.guard';
import { WsExceptionFilter } from 'src/common/exeption-filter/ws.exception-filter';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@WebSocketGateway({
  namespace: 'chats',
})
export class ChatsGateway implements OnGatewayConnection {
  constructor(
    private readonly configService: ConfigService,
    private readonly chatsService: ChatsService,
    private readonly messagesService: MessagesService,
  ) {}

  @WebSocketServer() server: Server;

  @UseGuards(WsBearerTokenGuard)
  handleConnection(socket: Socket) {
    console.log('New connection', socket.id);
    const rawToken = socket.handshake.headers.authorization;
    if (!rawToken) {
      throw new WsException('Token not found');
    }
    try {
      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      if (typeof jwtSecret !== 'string') {
        throw new WsException('JWT_SECRET not found');
      }
      const token = rawToken.split(' ')[1];
      const decoded = jwt.verify(token as string, jwtSecret);
      socket['userId'] = decoded['sub'];
    } catch (error) {
      socket.disconnect();
    }
  }

  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @UseFilters(WsExceptionFilter)
  @SubscribeMessage('create_chat')
  async createChat(@MessageBody() createChatDto: CreateChatDto) {
    const chat = await this.chatsService.createChat(createChatDto);
    this.server.emit('chat_created', chat);
  }

  @UsePipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @UseFilters(WsExceptionFilter)
  @SubscribeMessage('send_message')
  async sendMessage(
    @MessageBody() createMessageDto: CreateMessageDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const message = await this.messagesService.createMessage(
      createMessageDto,
      socket['userId'],
    );
    socket.to(createMessageDto.chatId.toString()).emit('message_sent', {
      id: message.id,
      author: {
        id: message.Author.id,
        username: message.Author.Profile.nickname,
      },
      message: message.message,
      createdAt: message.createdAt,
    });
  }
}
