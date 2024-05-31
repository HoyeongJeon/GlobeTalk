import { Injectable } from '@nestjs/common';
import { ReportUserDto } from './dto/report-user.dto';
import { ReportModel } from './entities/report.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(ReportModel)
    private readonly reportRepository: Repository<ReportModel>,
  ) {}

  async reportUser(reportUserDto: ReportUserDto) {
    await this.reportRepository.save(reportUserDto);
    console.log(reportUserDto);
  }
}
