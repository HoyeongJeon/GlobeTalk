import { IsOptional, IsString } from 'class-validator';

export class EditProfileDto {
  @IsOptional()
  @IsString()
  nickname: string;

  @IsOptional()
  @IsString()
  introduce: string;

  @IsOptional()
  @IsString()
  major: string;

  @IsOptional()
  @IsString({ each: true })
  language: string[];
}
