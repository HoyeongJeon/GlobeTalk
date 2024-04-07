import { PickType } from '@nestjs/mapped-types';
import { UserModel } from 'src/users/entities/user.entity';

export class LoginDto extends PickType(UserModel, [
  'email',
  'password',
] as const) {}
