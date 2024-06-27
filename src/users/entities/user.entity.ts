import { Exclude } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ReportModel } from 'src/admin/entities/report.entity';
import { ChatModel } from 'src/chats/entities/chat.entity';
import { BaseModel } from 'src/common/entities/base.entity';
import { MessageModel } from 'src/messages/entities/messages.entity';
import { ProfileModel } from 'src/profiles/entities/profile.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';

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
  ㅇ;

  @ManyToMany(() => ChatModel, (chat) => chat.Users)
  Chats: ChatModel[];

  @OneToMany(() => MessageModel, (message) => message.Author)
  Messages: MessageModel[];
}
