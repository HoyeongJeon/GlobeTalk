import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { EditProfileDto } from './dtos/editProfile.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMyProfile(@Request() req) {
    return await this.usersService.getProfile(req.user.sub);
  }

  @Get(':userId')
  async getProfile(@Param('userId', ParseIntPipe) userId: number) {
    return await this.usersService.getProfile(userId);
  }

  @UseInterceptors(FileInterceptor('imageUrl'))
  @Put('me')
  async editProfile(
    @Request() req,
    @Body() editProfileDto: EditProfileDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const user = req.user;
    return await this.usersService.editProfile(
      user.sub,
      editProfileDto,
      file?.filename,
    );
  }
}
