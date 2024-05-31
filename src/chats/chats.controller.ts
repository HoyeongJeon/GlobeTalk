import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Param,
  Body,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { MessagesService } from 'src/messages/messages.service';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatsController {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly messageService: MessagesService,
  ) {}

  // 랜덤 채팅 상대 확인
  @Get('random')
  async recommendUser(
    @Request() req,
    // @LoggedInUser() user: UserModel
  ) {
    const recommendedUser = await this.chatsService.recommendUser(req.user.sub);
    return recommendedUser;
  }

  // 채팅 요청
  @Post('random/:targetId')
  async postRequestChat(@Param('targetId') targetId: number, @Request() req) {
    const user = req.user;
    const result = await this.chatsService.sendChatRequest(user.sub, targetId);
    return result;
  }

  // 내가 보낸 채팅 요청 확인
  @Get('myRequests')
  async getMyRequest(@Request() req) {
    const user = req.user;
    const result = await this.chatsService.checkMyChatRequest(user.sub);

    return result;
  }

  // 내가 받은 채팅 요청 확인
  @Get('toMe')
  async getRequestsToMe(@Request() req) {
    const user = req.user;
    const result = await this.chatsService.checkChatRequestToMe(user.sub);

    if (result.length === 0) {
      return;
    }

    return result;
  }

  // 채팅 요청 응답
  @Post('toMe')
  async acceptChatRequest(
    @Request() req,
    @Body('targetId') targetId: number,
    @Body('isAccept') isAccept: boolean,
  ) {
    const user = req.user;
    const result = await this.chatsService.respondChatRequest(
      user.sub,
      targetId,
      isAccept,
    );
    return result;
  }

  // 채팅방 목록 확인
  @Get('rooms')
  async getChatRooms(@Request() req) {
    const user = req.user;
    const rooms = await this.chatsService.getChatRooms(user.sub);

    const addCurrentMessageToRooms = async (rooms) => {
      const roomWithCurrentMessage = await Promise.all(
        rooms.map(async (room) => {
          const currentMessage = await this.messageService.getCurrentMessage(
            room.id,
          );
          room.currentMessage = currentMessage;
          return room;
        }),
      );

      return roomWithCurrentMessage;
    };

    let roomsWithCurrentMessage = await addCurrentMessageToRooms(rooms);

    return roomsWithCurrentMessage;
  }

  // 채팅방 입장
  @Get('rooms/:roomId')
  async enterChatRoom(@Param('roomId') roomId: number, @Request() req) {
    const user = req.user;
    const result = await this.chatsService.enterChatRoom(user.sub, roomId);
    const messages = await this.messageService.getMessages(roomId);
    return { result, messages };
  }

  // 메시지 전송
  @Post('rooms/:roomId')
  async sendMessage(
    @Param('roomId') roomId: number,
    @Request() req,
    @Body('message') message: string,
  ) {
    const user = req.user;
    const result = await this.messageService.createMessage(
      { chatId: roomId, message },
      user,
    );

    return result;
  }
}
