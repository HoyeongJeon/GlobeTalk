import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from 'src/users/entities/user.entity';
import { ProfileModel } from 'src/profiles/entities/profile.entity';
import { RedisModule } from 'src/redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel, ProfileModel]), RedisModule],
  controllers: [ChatsController],
  providers: [ChatsService],
})
export class ChatsModule {}
