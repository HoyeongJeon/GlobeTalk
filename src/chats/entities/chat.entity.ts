import { BaseModel } from 'src/common/entities/base.entity';
import { Entity } from 'typeorm';

@Entity('chats')
export class ChatModel extends BaseModel {}
