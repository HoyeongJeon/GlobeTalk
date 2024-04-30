import { Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisController } from './redis.controller';
import { UsersModule } from 'src/users/users.module';

@Module({
  exports: [RedisService],
  imports: [UsersModule],
  controllers: [RedisController],
  providers: [RedisService],
})
export class RedisModule {}
