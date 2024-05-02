import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './entities/user.entity';
import { ProfileModel } from 'src/profiles/entities/profile.entity';

@Module({
  exports: [UsersService],
  imports: [TypeOrmModule.forFeature([UserModel, ProfileModel])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
