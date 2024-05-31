import { PickType } from '@nestjs/mapped-types';
import { ReportModel } from '../entities/report.entity';

export class ReportUserDto extends PickType(ReportModel, [
  'reporterId',
  'reporteeId',
  'reason',
]) {}
