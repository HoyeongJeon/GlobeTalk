import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileModel } from './entities/profile.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProfileModel])],
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {}
