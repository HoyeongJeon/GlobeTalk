import { BaseModel } from 'src/common/entities/base.entity';
import { UserModel } from 'src/users/entities/user.entity';
import { Column, Entity, OneToOne } from 'typeorm';

@Entity({
  name: 'profiles',
})
export class ProfileModel extends BaseModel {
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
  @Column()
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
