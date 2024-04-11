import { IsIn, IsOptional, IsString } from 'class-validator';
import { State } from 'src/common/enums/state.enum';

export class EditProfileDto {
  @IsOptional()
  @IsString()
  introduce?: string;

  @IsOptional()
  @IsString()
  major?: string;

  @IsOptional()
  @IsString({ each: true })
  language?: string[];

  @IsOptional()
  @IsString()
  @IsIn([State.EXCHANGE, State.NORMAL])
  state?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
