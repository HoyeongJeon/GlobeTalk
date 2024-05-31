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
  // namespace: /^\/chats\/.+$/,
  namespace: /^\/chats\/\d+$/,
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
    const rawToken = socket.handshake.query.token as string;
    if (!rawToken) {
      throw new WsException('Token not found');
    }
    const chatIds = socket.nsp.name.split('/').pop();
    try {
      const jwtSecret = this.configService.get<string>('JWT_SECRET');
      if (typeof jwtSecret !== 'string') {
        throw new WsException('JWT_SECRET not found');
      }
      const decoded = jwt.verify(rawToken as string, jwtSecret);
      socket['userId'] = decoded['sub'];
      socket.join(chatIds);
    } catch (error) {
      socket.disconnect();
    }
  }

  @SubscribeMessage('message')
  handleMessage(socket: Socket, data: any): void {
    console.log('message', data);
    this.server.emit('message', data);
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

  // @UsePipes(
  //   new ValidationPipe({
  //     transform: true, // dto에 정의된 타입으로 변환
  //     whitelist: true, // dto에 정의되지 않은 속성 제거
  //     forbidNonWhitelisted: true, // dto에 정의되지 않은 속성이 있을 경우 예외 발생
  //   }),
  // )
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

    socket.to(message.Chat.id.toString()).emit('receive_message', {
      id: message.id,
      Author: {
        id: message.Author.id,
        Profile: message.Author.Profile,
      },
      message: message.message,
      createdAt: message.createdAt,
    });
  }
}
