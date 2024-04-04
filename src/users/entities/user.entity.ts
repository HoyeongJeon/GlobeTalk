import { BaseModel } from 'src/common/entities/base.entity';
import { ProfileModel } from 'src/profiles/entities/profile.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity({
  name: 'users',
})
export class UserModel extends BaseModel {
  @Column({
    unique: true,
    length: 8, // 닉네임 8자리로 제한
  })
  nickname: string;

  @Column()
  password: string;

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
