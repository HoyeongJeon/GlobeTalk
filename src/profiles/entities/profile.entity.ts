import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entities/base.entity';
import { State } from 'src/common/enums/state.enum';
import { UserModel } from 'src/users/entities/user.entity';
import { Column, Entity, OneToOne } from 'typeorm';

@Entity({
  name: 'profiles',
})
export class ProfileModel extends BaseModel {
  /**
   * 사용자의 닉네임
   * @example 'john'
   */
  @IsString()
  @IsNotEmpty()
  @Column({
    unique: true,
    length: 8, // 닉네임 8자리로 제한
  })
  nickname: string;

  /**
   * 사용자의 소개글
   * @example Hi ! Im from Germany!
   */
  @Column('text')
  introduce: string;

  /**
   * 사용자의 전공
   * @example Computer Science
   */
  @Column()
  major: string;

  /**
   * 사용가능한 언어
   * @example ['ko', 'en', 'de']
   */
  @Column({
    type: 'simple-array',
  })
  language: string[];

  /**
   * 사용자가 일반 학생인지 교환학생인지 체크
   * @example exchange
   */
  @IsEnum(State)
  @Column({
    type: 'enum',
    enum: State,
    default: State.NORMAL,
  })
  state: string;

  /**
   * 사용자의 이미지 URL
   * @example https://www.google.com/image.png
   */
  @Column({
    default: 'https://www.google.com/image.png',
  })
  imageUrl: string;

  @OneToOne(() => UserModel, (user) => user.Profile)
  User: UserModel;
}
