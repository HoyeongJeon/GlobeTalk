import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entities/base.entity';
import { ProfileModel } from 'src/profiles/entities/profile.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity({
  name: 'users',
})
export class UserModel extends BaseModel {
  /**
   * 사용자의 이메일
   * @example test@test.com
   */
  @IsEmail()
  @IsNotEmpty()
  @Column({
    unique: true,
  })
  email: string;

  /**
   * 사용자의 비밀번호
   * @example 'password'
   */
  @IsString()
  // @Exclude()
  @Column()
  password: string;

  /**
   * 사용자의 국가
   * @example 'Korea'
   */
  @IsString()
  @Column()
  country: string;

  @OneToOne(() => ProfileModel, (profile) => profile.User, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  Profile: ProfileModel;
}
