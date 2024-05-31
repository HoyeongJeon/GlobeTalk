import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReportModel } from './entities/report.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReportModel])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
