import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import FileServiceAbtract from '../services/files/upload-file.abstract.service';
import { S3FileService } from '../services/files/s3-file.service';

@Module({
  controllers: [FileController],
  providers: [
    {
      provide: FileServiceAbtract,
      useClass: S3FileService,
    },
  ],
})
export class FileModule {}
