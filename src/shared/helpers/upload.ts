import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { randomUUID } from 'crypto';
import { mkdirSync } from 'fs';
import { diskStorage } from 'multer';

export function createDiskUploadOptions(destination: string): MulterOptions {
  mkdirSync(destination, { recursive: true });

  return {
    storage: diskStorage({
      destination,
      filename: (_req, file, cb) => {
        cb(null, `${randomUUID()}.${file.mimetype?.split('/')[1]?.split(';')[0]}`);
      }
    })
  };
}
