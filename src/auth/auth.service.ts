import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserModel } from 'src/users/entities/user.entity';
import { SignUpDto } from './dto/signUp.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ProfileModel } from 'src/profiles/entities/profile.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    @InjectRepository(ProfileModel)
    private readonly profileRepository: Repository<ProfileModel>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
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
    // const duplicatedNickname = await this.userRepository.findOne({
    //   where: { nickname },
    // });

    const duplicatedNickname = await this.profileRepository.findOne({
      where: { nickname },
    });

    if (duplicatedNickname) {
      throw new BadRequestException('이미 사용 중인 닉네임입니다.');
    }
  }

  async signup(signUpDto: SignUpDto, imageUrl?: string) {
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
      country,
      password: hashedPassword,
      Profile: {
        nickname,
        introduce,
        major,
        language,
        state,
        imageUrl,
      },
    });

    const newUser = await this.userRepository.save({
      ...userObj,
    });

    return {
      email: newUser.email,
      nickname: newUser.Profile.nickname,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: loginDto.email,
      },
      select: ['id', 'email', 'password'],
    });

    const ok = bcrypt.compareSync(loginDto.password, user?.password ?? '');

    if (!user || !ok) {
      throw new BadRequestException(
        '이메일 혹은 비밀번호가 일치하지 않습니다.',
      );
    }
    const tokens = await this.genUserToken(user);
    return tokens;
  }

  async genUserToken(user: Pick<UserModel, 'email' | 'id'>) {
    return {
      accessToken: await this.genAccessToken(user),
      refreshToken: await this.genRefreshToken(user),
    };
  }

  async genAccessToken(user: Pick<UserModel, 'email' | 'id'>) {
    const payload = { email: user.email, sub: user.id };
    // accessToken
    const accessToken = await this.jwtService.signAsync(
      {
        ...payload,
        type: 'access',
      },
      {
        expiresIn: this.configService.get<string>(
          'JWT_ACCESS_TOKEN_EXPIRATION',
        ),
      },
    );
    return accessToken;
  }

  async genRefreshToken(user: Pick<UserModel, 'email' | 'id'>) {
    const payload = { email: user.email, sub: user.id };
    // refreshToken
    const refreshToken = await this.jwtService.signAsync(
      {
        ...payload,
        type: 'refresh',
      },
      {
        expiresIn: this.configService.get<string>(
          'JWT_REFRESH_TOKEN_EXPIRATION',
        ),
      },
    );
    return refreshToken;
  }
}
