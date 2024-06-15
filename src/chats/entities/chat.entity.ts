import { ReportModel } from 'src/admin/entities/report.entity';
import { BaseModel } from 'src/common/entities/base.entity';
import { MessageModel } from 'src/messages/entities/messages.entity';
import { UserModel } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';

@Entity('chats')
export class ChatModel extends BaseModel {
  @ManyToMany(() => UserModel, (user) => user.Chats)
  @JoinTable()
  Users: UserModel[];

  @OneToMany(() => MessageModel, (message) => message.Chat)
  Messages: MessageModel[];

  @OneToOne(() => ReportModel, (report) => report.Chat)
  @Column('boolean', {
    nullable: false,
    default: false,
  })
  IsReported: boolean;
}
