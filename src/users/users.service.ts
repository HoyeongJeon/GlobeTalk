import { BadRequestException, Injectable } from '@nestjs/common';
import { UserModel } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EditProfileDto } from './dtos/editProfile.dto';
import { ProfileModel } from 'src/profiles/entities/profile.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,

    @InjectRepository(ProfileModel)
    private readonly profileRepository: Repository<ProfileModel>,
  ) {}
  async getProfile(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new BadRequestException('유저가 존재하지 않습니다.');
    }
    return user;
  }

  async editProfile(userId: number, editProfileDto: EditProfileDto) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new BadRequestException('유저가 존재하지 않습니다.');
    }

    console.log(user.Profile);

    const profile = await this.profileRepository.findOne({
      where: {
        id: user.Profile.id,
      },
    });
    // await this.profileRepository.update(profile.id, {
    //   ...editProfileDto,
    // });

    // return await this.profileRepository.findOne({
    //   where: {
    //     User: user,
    //   },
    // });
    return await this.profileRepository.save({
      ...profile,
      ...editProfileDto,
    });
  }
}
