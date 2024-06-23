import { IsIn, IsNumber, IsOptional } from 'class-validator';

export class PaginateUserDto {
  @IsNumber()
  @IsOptional()
  where__id_more_than?: number;

  @IsIn(['ASC', 'DESC'])
  @IsOptional()
  order__createdAt: 'ASC' | 'DESC' = 'ASC';

  @IsNumber()
  @IsOptional()
  take: number = 20;
}
