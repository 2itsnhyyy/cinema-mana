import { Injectable } from '@nestjs/common';

export type UploadOptions = { file: Express.Multer.File; fileName: string };
export type UploadResponse = { url: string; key: string };

@Injectable()
export default abstract class FileServiceAbtract {
  abstract uploadFile(
    path: string,
    { file, fileName }: UploadOptions,
  ): Promise<UploadResponse>;
}
