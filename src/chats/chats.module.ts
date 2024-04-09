import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from 'src/users/entities/user.entity';
import { ProfileModel } from 'src/profiles/entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel, ProfileModel])],
  controllers: [ChatsController],
  providers: [ChatsService],
})
export class ChatsModule {}
