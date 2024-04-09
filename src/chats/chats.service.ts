import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { State } from 'src/common/enums/state.enum';
import { ProfileModel } from 'src/profiles/entities/profile.entity';
@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    @InjectRepository(ProfileModel)
    private readonly profileRepository: Repository<ProfileModel>,
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

    // 아래 랜덤한 유저 추천받을 수 있도록 변경해야함.
    // const recommendedUser = await this.profileRepository.findOne({
    //   where: { state: recommendedState },
    // });
    const recommendedUser = await this.profileRepository
      .createQueryBuilder('profile')
      .where('profile.state = :recommendedState', { recommendedState })
      .orderBy('RAND()')
      .getOne();

    return recommendedUser;
  }
}
