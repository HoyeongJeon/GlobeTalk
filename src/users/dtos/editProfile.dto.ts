import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
import { SignUpDto } from 'src/auth/dto/signUp.dto';

export class EditProfileDto extends PartialType(SignUpDto) {
  @IsOptional()
  @IsString()
  nickname?: string;

  @IsOptional()
  @IsString()
  introduce?: string;

  @IsOptional()
  @IsString()
  major?: string;

  @IsOptional()
  @IsString({ each: true })
  language?: string[];
}
