import { IsString } from 'class-validator';
import { ChatModel } from 'src/chats/entities/chat.entity';
import { BaseModel } from 'src/common/entities/base.entity';
import { UserModel } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('messages')
export class MessageModel extends BaseModel {
  @ManyToOne(() => ChatModel, (chat) => chat.Messages)
  Chat: ChatModel;

  @ManyToOne(() => UserModel, (user) => user.Messages, {
    eager: true,
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  Author: UserModel;

  @Column()
  @IsString()
  message: string;
}
