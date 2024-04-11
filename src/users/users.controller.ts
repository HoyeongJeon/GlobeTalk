import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { EditProfileDto } from './dtos/editProfile.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyProfile(@Request() req) {
    return await this.usersService.getProfile(req.user.sub);
  }

  @Get(':userId')
  async getProfile(@Param('userId', ParseIntPipe) userId: number) {
    return await this.usersService.getProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async editProfile(@Request() req, @Body() editProfileDto: EditProfileDto) {
    return await this.usersService.editProfile(req.user.sub, editProfileDto);
  }
}
