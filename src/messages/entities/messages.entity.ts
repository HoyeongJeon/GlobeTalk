import { BaseModel } from 'src/common/entities/base.entity';
import { Entity } from 'typeorm';

@Entity('messages')
export class MessageModel extends BaseModel {}
