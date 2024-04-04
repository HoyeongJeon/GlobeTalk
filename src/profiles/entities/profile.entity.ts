import { BaseModel } from 'src/common/entities/base.entity';
import { UserModel } from 'src/users/entities/user.entity';
import { Column, Entity, OneToOne } from 'typeorm';

@Entity({
  name: 'profiles',
})
export class ProfileModel extends BaseModel {
  @Column('text')
  introduce: string;

  @Column()
  major: string;

  @Column()
  language: string;

  @Column()
  state: string;

  @Column()
  imageUrl: string;

  @OneToOne(() => UserModel, (user) => user.Profile)
  User: UserModel;
}
