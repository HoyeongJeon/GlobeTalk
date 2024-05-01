import {
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import { LoggedInUser } from 'src/common/decorators/user.decorator';
import { UserModel } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RedisService } from 'src/redis/redis.service';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatsController {
  constructor(
    private readonly chatsService: ChatsService,
    private readonly redisService: RedisService,
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
    const result = await this.redisService.sendChatRequest(user.sub, targetId);
    return result;
  }

  // 내가 보낸 채팅 요청 확인
  @Get('myRequests')
  async getMyRequest(@Request() req) {
    const user = req.user;
    const result = await this.redisService.checkMyChatRequest(user.sub);

    return result;
  }

  // 내가 받은 채팅 요청 확인
  @Get('toMe')
  async getRequestsToMe(@Request() req) {
    const user = req.user;
    const result = await this.redisService.checkChatRequestToMe(user.sub);
    if (result.length === 0) {
      return '받은 채팅 요청이 없습니다.';
    }

    return result;
  }

  // 채팅 요청 수락
  @Post('toMe')
  async acceptChatRequest(@Request() req) {
    const user = req.user;
  }
}
