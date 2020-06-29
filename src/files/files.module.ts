import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';

import { FilesController } from './files.controller';
import { FilesConfig } from './files.config';
import { File } from './files.entity';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([File]),
    MulterModule.register(FilesConfig),
    forwardRef(() => UserModule),
    AuthModule,
  ],
  controllers: [FilesController],
})
export class FileModule {}
