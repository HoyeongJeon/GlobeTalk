import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { ChatsService } from './chats.service';
import { Server, Socket } from 'socket.io';
import { CreateChatDto } from './dto/create-chat.dto';

export class ChatsGateway implements OnGatewayConnection {
  constructor(private readonly chatsService: ChatsService) {}

  @WebSocketServer() server: Server;

  handleConnection(socket: Socket) {
    console.log('New connection', socket.id);
  }

  @SubscribeMessage('create_chat')
  async createChat(@MessageBody() createChatDto: CreateChatDto) {
    const chat = await this.chatsService.createChat(createChatDto);
    // this.server.emit('chat_created', chat);
  }
}
