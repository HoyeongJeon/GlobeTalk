import {
  Body,
  Controller,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @UseInterceptors(FileInterceptor('profile'))
  async signup(
    @Body() signUpDto: SignUpDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const { email } = signUpDto;
    if (email.split('@')[1] !== 'dankook.ac.kr') {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'Only Dankook University email is allowed',
      };
    }

    const result = await this.authService.signup(signUpDto, file?.filename);
    return {
      status: HttpStatus.OK,
      data: result,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return req.user;
    // return {
    //   status: HttpStatus.OK,
    //   data: req.user,
    // };
  }
}
