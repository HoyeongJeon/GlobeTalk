import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { State } from 'src/common/enums/state.enum';
import { ProfileModel } from 'src/profiles/entities/profile.entity';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatModel } from './entities/chat.entity';
import { RedisService } from 'src/redis/redis.service';
@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    @InjectRepository(ProfileModel)
    private readonly profileRepository: Repository<ProfileModel>,
    @InjectRepository(ChatModel)
    private readonly chatRepository: Repository<ChatModel>,
    private readonly redisService: RedisService,
  ) {}

  // 랜덤 채팅 상대 추천

  async recommendUser(userId: number) {
    const {
      Profile: { state },
    } = await this.userRepository.findOne({
      where: { id: userId },
    });

    const recommendedState =
      state === State.NORMAL ? State.EXCHANGE : State.NORMAL;

    const recommendedUser = await this.profileRepository
      .createQueryBuilder('profile')
      .where('profile.state = :recommendedState', { recommendedState })
      .orderBy('RAND()')
      .getOne();

    return recommendedUser;
  }

  /**
   * 채팅 요청
   * @param userId 요청자 ID
   * @param targetId 대상자 ID
   * @returns
   */
  async sendChatRequest(userId: number, targetId: number) {
    await this.redisService.sendChatRequest(userId, targetId);
    return `${userId}님이 ${targetId}님에게 채팅을 요청했습니다.`;
  }

  /**
   * 내가 보낸 채팅 요청 확인
   * @param userId 신청자 ID
   * @returns
   */

  async checkMyChatRequest(userId: number) {
    const reqs = await this.redisService.checkMyChatRequest(userId);
    return reqs;
  }

  /**
   * 내게 온 채팅 요청 확인
   * @param userId 대상자 ID
   * @returns
   */
  async checkChatRequestToMe(userId: number) {
    const reqs = await this.redisService.checkChatRequestToMe(userId);
    return reqs;
  }

  /**
   * 채팅 요청 응답
   * @param userId 응답자 ID
   * @param targetId 요청자 ID
   * @param isAccept 수락 여부
   * @returns
   */
  async respondChatRequest(
    userId: number,
    targetId: number,
    isAccept: boolean,
  ) {
    const isUserExist = await this.userRepository.findOne({
      where: { id: targetId },
    });
    if (!isUserExist) {
      return '유저가 존재하지 않습니다.';
    }

    if (isAccept) {
      await this.redisService.removeChatRequest(userId, targetId);
      const chat = await this.createChat({
        userIds: [userId, targetId],
      });

      return chat;
    } else {
      await this.redisService.removeChatRequest(userId, targetId);
      return '채팅 요청을 거절했습니다.';
    }
  }

  /**
   * 채팅방 생성
   * @param createChatDto 채팅방 생성 DTO
   * @returns ChatModel
   * */
  async createChat(createChatDto: CreateChatDto) {
    const chat = await this.chatRepository.save({
      Users: createChatDto.userIds.map((id) => ({ id })),
    });

    return await this.chatRepository.findOne({
      where: { id: chat.id },
    });
  }
}
