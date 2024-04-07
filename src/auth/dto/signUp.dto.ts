import { PickType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsIn,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';
import { UserModel } from 'src/users/entities/user.entity';

enum State {
  EXCHANGE = 'exchange',
  NORMAL = 'normal',
}

export class SignUpDto extends PickType(UserModel, [
  'email',
  'password',
  'nickname',
  'country',
] as const) {
  @IsString()
  @IsNotEmpty()
  //   @IsStrongPassword(
  //     { minLength: 8 },
  //     {
  //       message:
  //         '비밀번호는 최소 6자리에 숫자, 영문 대문자, 영문 소문자, 특수문자가 포함되어야 합니다.',
  //     },
  //   )
  passwordConfirm: string;

  @IsString()
  @IsNotEmpty()
  introduce: string;

  @IsString()
  @IsNotEmpty()
  major: string;

  @IsArray()
  @IsNotEmpty()
  language: string[];

  @IsString()
  @IsNotEmpty()
  @IsIn([State.EXCHANGE, State.NORMAL]) // enum을 사용할 때는 @IsEnum을 사용하지 않고 @IsIn을 사용해야 한다.
  state: State;

  @IsString()
  @IsNotEmpty()
  imageUrl: string;
}
