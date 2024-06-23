import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ReportUserDto } from './dto/report-user.dto';
import { UsersService } from 'src/users/users.service';
import { PaginateUserDto } from './dto/paginate-user.dto';

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
    await this.adminService.reportUser(reportUserDto);
    return '신고 완료!';
  }

  @Get('/users')
  async getAllUsers(@Query() query: PaginateUserDto) {
    const users = await this.usersService.paginateUsers(query);
    return users;
  }
}
