import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import IORedis from 'ioredis';

@Injectable()
export class RedisService {
  private readonly redisClient: IORedis;
  constructor(private readonly configService: ConfigService) {
    this.redisClient = new IORedis({
      host: this.configService.get<string>('REDIS_HOST'),
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
    /**
     * userId를 key로 하여 targetId를 value로 저장
     * 객체로 저장
     */
    // const result = await this.redisClient.set(`${userId}`, targetId);
    await this.redisClient.sadd(`From_${userId}`, `${targetId}`);
    return `${userId}님이 ${targetId}님에게 채팅을 요청했습니다.`;
  }

  /**
   * 내가 보낸 채팅 요청 확인
   * @param userId 신청자 ID
   * @returns
   */
  async checkMyChatRequest(userId: number) {
    return await this.redisClient.smembers(`From_${userId}`);
  }

  /**
   * 내게 온 채팅 요청 확인
   * @param userId 대상자 ID
   * @returns
   */
}