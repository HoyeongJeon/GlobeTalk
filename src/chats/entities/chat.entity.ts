import { BaseModel } from 'src/common/entities/base.entity';
import { MessageModel } from 'src/messages/entities/messages.entity';
import { UserModel } from 'src/users/entities/user.entity';
import { Entity, ManyToMany, OneToMany } from 'typeorm';

@Entity('chats')
export class ChatModel extends BaseModel {
  @ManyToMany(() => UserModel, (user) => user.Chats)
  Users: UserModel[];

  @OneToMany(() => MessageModel, (message) => message.Chat)
  Messages: MessageModel[];
}
