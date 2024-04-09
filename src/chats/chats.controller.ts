import { Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { LoggedInUser } from 'src/common/decorators/user.decorator';
import { UserModel } from 'src/users/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

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
  async requestChat() {}
}
