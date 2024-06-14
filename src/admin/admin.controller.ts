import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ReportUserDto } from './dto/report-user.dto';
import { UsersService } from 'src/users/users.service';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly usersService: UsersService,
  ) {}

  @Get('/')
  async getAdmin() {
    const result = await this.adminService.getReportedUsers();
    return result;
  }

  @Post('/report')
  async postReport(@Body() reportUserDto: ReportUserDto) {
    console.log(reportUserDto);
    await this.adminService.reportUser(reportUserDto);
    return '신고 완료!';
  }

  @Get('/users')
  async getAllUsers() {
    const users = await this.usersService.getAllUsers();
    return users;
  }
}
