import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import IORedis from 'ioredis';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RedisService {
  private readonly redisClient: IORedis;
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    this.redisClient = new IORedis({
      // host: this.configService.get<string>('REDIS_HOST'),
      host: 'globetalk_be_redis',
      port: this.configService.get<number>('REDIS_PORT'),
      //   password: this.configService.get<string>('REDIS_PASSWORD'),
    });
    this.redisClient.on('connect', () => {
      console.log('Redis connected');
    });
    this.redisClient.on('error', (error) => {
      console.error('Redis error', error);
    });
  }

  /**
   * 채팅 신청 저장.
   * @param userId 신청자 ID
   * @param targetId 대상자 ID
   */
  async sendChatRequest(userId: number, targetId: number) {
    const isUserExist = await this.usersService.getProfile(targetId);
    if (!isUserExist) {
      return '유저가 존재하지 않습니다.';
    }

    await this.redisClient.sadd(`From_${userId}`, `${targetId}`);
    await this.redisClient.sadd(`To_${targetId}`, `${userId}`);
  }

  /**
   * 내가 보낸 채팅 요청 확인
   * @param userId 신청자 ID
   * @returns
   */
  async checkMyChatRequest(userId: number) {
    const reqs = await this.redisClient.smembers(`From_${userId}`);

    const users = await Promise.all(
      reqs.map(async (req) => {
        const user = await this.usersService.getProfile(Number(req));
        return user.Profile.nickname;
      }),
    );

    return users;
  }

  /**
   * 내게 온 채팅 요청 확인
   * @param userId 대상자 ID
   * @returns
   */
  async checkChatRequestToMe(userId: number) {
    const reqs = await this.redisClient.smembers(`To_${userId}`);
    const users = await Promise.all(
      reqs.map(async (req) => {
        const user = await this.usersService.getProfile(Number(req));

        delete user.Profile.createdAt;
        delete user.Profile.updatedAt;

        return { ...user.Profile, country: user.country };
      }),
    );

    return users;
  }

  /**
   * 채팅 요청 답변
   * @param userId 대상자 ID
   * @param targetId 신청자 ID
   * @param isAccept 수락 여부
   * @returns
   */
  async removeChatRequest(userId: number, targetId: number) {
    const isExist = await this.redisClient.sismember(
      `From_${targetId}`,
      `${userId}`,
    );
    if (!isExist) {
      return '해당 요청이 존재하지 않습니다.';
    }
    await this.redisClient.srem(`From_${targetId}`, `${userId}`);
    await this.redisClient.srem(`To_${userId}`, `${targetId}`);
  }
}
