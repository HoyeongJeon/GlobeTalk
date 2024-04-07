import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from 'src/users/entities/user.entity';
import { SignUpDto } from './dto/signUp.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    private readonly configService: ConfigService,
  ) {}

  async duplicatedEmailCheck(email: string) {
    const duplicatedEmail = await this.userRepository.findOne({
      where: { email },
    });
    if (duplicatedEmail) {
      throw new BadRequestException('이미 가입된 이메일입니다.');
    }
  }

  async duplicatedNicknameCheck(nickname: string) {
    const duplicatedNickname = await this.userRepository.findOne({
      where: { nickname },
    });
    if (duplicatedNickname) {
      throw new BadRequestException('이미 사용 중인 닉네임입니다.');
    }
  }

  async signup(signUpDto: SignUpDto) {
    const {
      email,
      nickname,
      country,
      password,
      passwordConfirm,
      introduce,
      major,
      language,
      state,
    } = signUpDto;

    await this.duplicatedEmailCheck(email);
    await this.duplicatedNicknameCheck(nickname);

    if (password !== passwordConfirm) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }
    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(this.configService.get<string>('BCRYPT_SALT_ROUNDS')),
    );

    const userObj = this.userRepository.create({
      email,
      nickname,
      country,
      password: hashedPassword,
      Profile: {
        introduce,
        major,
        language,
        state,
      },
    });

    const newUser = await this.userRepository.save({
      ...userObj,
    });

    return {
      email: newUser.email,
      nickname: newUser.nickname,
    };
  }
}
