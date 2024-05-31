import { Body, Controller, Get, Post } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ReportUserDto } from './dto/report-user.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // 어드민 페이지
  @Get('/')
  async getAdmin() {}

  @Post('/report')
  async postReport(@Body() reportUserDto: ReportUserDto) {
    const result = await this.adminService.reportUser(reportUserDto);
    return '신고 완료!';
  }
}
