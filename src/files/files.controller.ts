import { Controller, Post, UseInterceptors, UploadedFile, UseGuards } from "@nestjs/common";
import { GetCurrentUserRest } from "../utils/GetCurrentUser.util";
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuardRest } from "../auth/auth.guard";
import { File } from "./files.entity";
import { Express } from 'express';
import { UserService } from "../user/user.service";

type IFile = Express.Multer.File;

@Controller()
export class FilesController {
  constructor(
    private userService: UserService
  ) {}

  @UseGuards(AuthGuardRest)
  @Post('/profile')
  @UseInterceptors(FileInterceptor('file'))
  async sendProfilePic(
    @UploadedFile() uploadedFile: IFile,
    @GetCurrentUserRest() userId: number
  ) {
    const user = await this.userService.findOne(userId);

    const file = new File();
    file.name = uploadedFile.filename;
    file.originalName = uploadedFile.originalname,
    file.type = uploadedFile.mimetype;

    user.profile = file;

    await file.save();
    await user.save();

    return { file };
  }
}