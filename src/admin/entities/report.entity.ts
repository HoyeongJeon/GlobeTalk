import { IsInt, IsString } from 'class-validator';
import { ChatModel } from 'src/chats/entities/chat.entity';
import { BaseModel } from 'src/common/entities/base.entity';
import { UserModel } from 'src/users/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity('reports')
export class ReportModel extends BaseModel {
  @OneToOne(() => ChatModel, (chat) => chat.IsReported)
  @JoinColumn()
  Chat: number;

  // 신고한 유저
  @IsInt()
  @Column({
    type: 'int',
    unsigned: true,
  })
  reporterId: number;

  // 신고 당한 유저
  @IsInt()
  @Column({
    type: 'int',
    unsigned: true,
  })
  reporteeId: number;

  // 신고 내용
  @IsString()
  @Column({
    type: 'text',
  })
  reason: string;
}
