import {
  Body,
  Controller,
  HttpStatus,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signUp.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signUpDto: SignUpDto) {
    const result = await this.authService.signup(signUpDto);
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
