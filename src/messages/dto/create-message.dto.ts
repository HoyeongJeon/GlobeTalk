import { PickType } from '@nestjs/mapped-types';
import { MessageModel } from '../entities/messages.entity';
import { IsNumber } from 'class-validator';

export class CreateMessageDto extends PickType(MessageModel, [
  'message',
] as const) {
  @IsNumber()
  readonly chatId: number;
}
