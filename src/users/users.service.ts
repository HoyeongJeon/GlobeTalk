import { BadRequestException, Body, Injectable, Query } from '@nestjs/common';
import { UserModel } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { EditProfileDto } from './dtos/editProfile.dto';
import { ProfileModel } from 'src/profiles/entities/profile.entity';
import { PaginateUserDto } from 'src/admin/dto/paginate-user.dto';
import { url } from 'inspector';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,

    @InjectRepository(ProfileModel)
    private readonly profileRepository: Repository<ProfileModel>,
  ) {}

  async paginateUsers(dto: PaginateUserDto) {
    const users = await this.userRepository.find({
      where: {
        id: MoreThan(dto.where__id_more_than ?? 0),
      },
      order: {
        createdAt: dto.order__createdAt,
      },
      take: dto.take,
    });

    // 유저가 0 명보다 많으면, 마지막 유저를 가져오고
    // 아니면 null 반환
    const lastUser =
      users.length > 0 && users.length === dto.take
        ? users[users.length - 1]
        : null;
    const nextUrl = lastUser && new URL('http://localhost:3000/admin/users');

    if (nextUrl) {
      for (const key of Object.keys(dto)) {
        if (key !== 'where__id_more_than') {
          nextUrl.searchParams.append(key, dto[key]);
        }
      }
      nextUrl.searchParams.append(
        'where__id_more_than',
        lastUser.id.toString(),
      );
    }

    return {
      data: {
        users,
      },
      cursor: {
        after: lastUser?.id ?? null,
      },
      count: users.length,
      next: nextUrl?.toString() ?? null,
    };
  }

  async getAllUsers() {
    const users = await this.userRepository.find({ relations: ['Profile'] });
    return users;
  }

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

  async editProfile(
    userId: number,
    editProfileDto: EditProfileDto,
    imageUrl?: string,
  ) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new BadRequestException('유저가 존재하지 않습니다.');
    }

    const profile = await this.profileRepository.findOne({
      where: {
        id: user.Profile.id,
      },
    });

    if (!profile) {
      throw new BadRequestException('프로필이 존재하지 않습니다.');
    }

    const isExist = await this.profileRepository.findOne({
      where: {
        nickname: editProfileDto.nickname,
      },
    });

    if (isExist && isExist.nickname !== profile.nickname) {
      throw new BadRequestException('이미 존재하는 닉네임입니다.');
    }

    const upadatedImgUrl = imageUrl ? imageUrl : profile.imageUrl;
    return await this.profileRepository.save({
      ...profile,
      ...editProfileDto,
      imageUrl: upadatedImgUrl,
    });
  }
}
