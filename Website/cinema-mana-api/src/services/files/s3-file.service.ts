import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import FileServiceAbtract, {
  UploadOptions,
  UploadResponse,
} from './upload-file.abstract.service';

@Injectable()
export class S3FileService extends FileServiceAbtract {
  private s3_client: S3Client;
  constructor(private readonly configService: ConfigService) {
    super();
    this.s3_client = new S3Client({
      region: configService.get('AWS_S3_REGION'),
      credentials: {
        accessKeyId: configService.get('AWS_S3_ACCESS_KEY_ID'),
        secretAccessKey: configService.get('AWS_S3_SECRET_ACCESS_KEY'),
      },
    });
  }
  async uploadFile(
    path: string,
    { file, fileName }: UploadOptions,
  ): Promise<UploadResponse> {
    const bucket_name = this.configService.get('AWS_S3_PUBLIC_BUCKET');
    const key = `${path}/${Date.now().toString()}-${fileName}`;
    await this.s3_client.send(
      new PutObjectCommand({
        Bucket: bucket_name,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
        ContentLength: file.size, // calculate length of buffer
      }),
    );

    return {
      key: key,
      url: `https://${bucket_name}.s3.amazonaws.com/${key}`,
    };
  }
}
