import { IsInt, IsString } from 'class-validator';
import { BaseModel } from 'src/common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('reports')
export class ReportModel extends BaseModel {
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
