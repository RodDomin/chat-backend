import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import * as path from 'path';
import crypto from 'crypto';

export const FilesConfig = {
  storage: diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'upload'),
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err, null)

        const [, ext] = file.originalname.split('.')

        const fileName = `${hash.toString('hex')}.${ext}`
        cb(null, fileName)
      })
    }
  })
} as MulterOptions;
