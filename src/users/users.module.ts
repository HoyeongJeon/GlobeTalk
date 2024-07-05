import { BadRequestException, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './entities/user.entity';
import { ProfileModel } from 'src/profiles/entities/profile.entity';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer';
import { v4 as uuid } from 'uuid';
import { CommonModule } from 'src/common/common.module';
@Module({
  exports: [UsersService],
  imports: [
    TypeOrmModule.forFeature([UserModel, ProfileModel]),
    MulterModule.register({
      limits: {
        fileSize: 1024 * 1024 * 5,
      },
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);

        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
          return cb(new BadRequestException('Only images are allowed'), false);
        }

        return cb(null, true);
      },
      storage: multer.diskStorage({
        destination: function (req, res, cb) {
          cb(null, 'uploads/');
        },
        filename: function (req, file, cb) {
          cb(null, `${uuid()}${extname(file.originalname)}`);
        },
      }),
    }),
    CommonModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
