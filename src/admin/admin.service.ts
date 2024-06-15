import { Injectable } from '@nestjs/common';
import { ReportUserDto } from './dto/report-user.dto';
import { ReportModel } from './entities/report.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatModel } from 'src/chats/entities/chat.entity';
import { UserModel } from 'src/users/entities/user.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(ReportModel)
    private readonly reportRepository: Repository<ReportModel>,
    @InjectRepository(ChatModel)
    private readonly chatRepository: Repository<ChatModel>,
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
  ) {}

  async getReportedUsers() {
    const records = await this.reportRepository.find({
      relations: ['Chat'],
    });
    const editedRecords = await Promise.all(
      records.map(async (record) => {
        const reporter = await this.userRepository.findOne({
          where: {
            id: record.reporterId,
          },
        });
        const reportee = await this.userRepository.findOne({
          where: {
            id: record.reporteeId,
          },
        });

        if (reporter) {
          delete reporter.password;
        }

        if (reportee) {
          delete reportee.password;
        }

        return {
          id: record.id,
          reporter,
          reportee,
          reason: record.reason,
          Chat: record.Chat,
        };
      }),
    );
    return editedRecords;
  }

  async reportUser(reportUserDto: ReportUserDto) {
    const chat = await this.chatRepository.findOne({
      where: {
        id: reportUserDto.chatId,
      },
    });
    chat.IsReported = true;
    await this.chatRepository.save(chat);

    const report = new ReportModel();
    report.Chat = chat.id;
    report.reporterId = reportUserDto.reporterId;
    report.reporteeId = reportUserDto.reporteeId;
    report.reason = reportUserDto.reason;
    await this.reportRepository.save(report);

    return '신고 완료!';
  }
}
