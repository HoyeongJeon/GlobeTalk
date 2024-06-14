import { PickType } from '@nestjs/mapped-types';
import { ReportModel } from '../entities/report.entity';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ReportUserDto extends PickType(ReportModel, [
  'reporterId',
  'reporteeId',
  'reason',
]) {
  // 신고할 채팅방 ID
  @IsNotEmpty({ message: '채팅방 ID는 필수입니다.' })
  @IsNumber({}, { message: '채팅방 ID는 숫자여야 합니다.' })
  chatId: number;
}
