import { Controller, Post, UseInterceptors, UploadedFile, UseGuards } from "@nestjs/common";
import { UserId } from "../utils/user-id.decorator";
import { FileInterceptor } from '@nestjs/platform-express';
import { File } from "./files.entity";
import { UserService } from "../user/user.service";
import { AuthGuard } from "../auth/auth.guard";

type IFile = Express.Multer.File;

@Controller()
export class FilesController {
  constructor(
    private userService: UserService
  ) {}

  @UseGuards(AuthGuard)
  @Post('/profile')
  @UseInterceptors(FileInterceptor('file'))
  async sendProfilePic(
    @UploadedFile() uploadedFile: IFile,
    @UserId() userId: number
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