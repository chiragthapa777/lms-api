import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  DeleteObjectCommand,
  DeleteObjectCommandInput,
  DeleteObjectCommandOutput,
  DeleteObjectsCommand,
  DeleteObjectsCommandInput,
  DeleteObjectsCommandOutput,
  GetObjectCommand,
  GetObjectCommandInput,
  GetObjectCommandOutput,
  GetObjectOutput,
  ListObjectsV2Command,
  ListObjectsV2CommandInput,
  ListObjectsV2CommandOutput,
  ListObjectsV2Output,
  ObjectCannedACL,
  ObjectIdentifier,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  S3Client,
  _Object,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';
import { IAwsS3PutItemOptions } from '../interfaces/aws.interface';
import {
  AwsS3Serialization,
  AwsS3SerializationCustom,
} from '../serializations/aws.s3.serialization';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';

@Injectable()
export class AwsS3Service {
  private readonly s3Client: S3Client;
  private readonly bucket: string | undefined;
  private readonly baseUrl: string | undefined;
  private readonly assetUrl: string | undefined;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      credentials: {
        accessKeyId: this.configService.get<string>('aws.credential.key', ''),
        secretAccessKey: this.configService.get<string>(
          'aws.credential.secret',
          '',
        ),
      },
      endpoint:
        'https://2b299039cdf64d969b923b9ffca0556b.r2.cloudflarestorage.com/',
      region: 'auto',
    });

    this.bucket = this.configService.get<string>('aws.s3.bucket');
    this.baseUrl = this.configService.get<string>('aws.s3.baseUrl');
    this.assetUrl = this.configService.get<string>('aws.s3.assetUrl');
  }

  async listItemInBucket(
    prefix?: string,
  ): Promise<AwsS3Serialization[] | undefined | any> {
    const command: ListObjectsV2Command = new ListObjectsV2Command({
      Bucket: this.bucket,
      Prefix: prefix,
    });

    try {
      const listItems: ListObjectsV2Output = await this.s3Client.send<
        ListObjectsV2CommandInput,
        ListObjectsV2CommandOutput
      >(command);

      const mapList = listItems?.Contents?.map((val: _Object) => {
        if (!val.Key) {
          return undefined;
        }
        const lastIndex: number = val.Key.lastIndexOf('/');
        const path: string = val.Key.substring(0, lastIndex);
        const filename: string = val.Key.substring(
          lastIndex + 1,
          val.Key.length,
        );
        const mime: string = filename
          .substring(filename.lastIndexOf('.') + 1, filename.length)
          .toLocaleUpperCase();

        return {
          path,
          pathWithFilename: val.Key,
          filename: filename,
          completedUrl: `${this.assetUrl}/${val.Key}`,
          baseUrl: this.baseUrl,
          mime,
        };
      });

      return mapList;
    } catch (err: any) {
      throw err;
    }
  }

  async getItemInBucket(
    filename: string,
    path?: string,
    bucket?: string,
  ): Promise<{ body: Readable; contentType?: string; size?: number }> {
    if (path) path = path.startsWith('/') ? path.replace('/', '') : `${path}`;

    const key: string = path ? `${path}/${filename}` : filename;
    const command: GetObjectCommand = new GetObjectCommand({
      Bucket: bucket || this.bucket,
      Key: key,
    });

    try {
      const item: GetObjectOutput = await this.s3Client.send<
        GetObjectCommandInput,
        GetObjectCommandOutput
      >(command);

      return {
        body: item.Body as Readable,
        contentType: item.ContentType,
        size: item.ContentLength,
      };
    } catch (err: any) {
      throw err;
    }
  }

  async computedAwsData(
    filename: string,
    options: IAwsS3PutItemOptions,
  ): Promise<AwsS3Serialization> {
    let path: string = options?.path;
    if (path) path = path.startsWith('/') ? path.replace('/', '') : `${path}`;
    const mime: string = filename
      .substring(filename.lastIndexOf('.') + 1, filename.length)
      .toUpperCase();
    const key: string = path ? `${path}/${filename}` : filename;
    return {
      path,
      pathWithFilename: key,
      filename: filename,
      completedUrl: `${this.assetUrl}/${key}`,
      baseUrl: this.baseUrl,
      mime,
    };
  }

  async putItemInBucket(
    filename: string,
    bucket: string,
    content: string | Uint8Array | Buffer | Readable | ReadableStream | Blob,
    options: IAwsS3PutItemOptions,
  ): Promise<AwsS3Serialization> {
    let path: string = options?.path;
    const acl: any = options?.acl ? options.acl : ObjectCannedACL.public_read;

    if (path) path = path.startsWith('/') ? path.replace('/', '') : `${path}`;

    const mime: string = filename
      .substring(filename.lastIndexOf('.') + 1, filename.length)
      .toUpperCase();
    const key: string = path ? `${path}/${filename}` : filename;
    const command: PutObjectCommand = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: content,
      ACL: acl,
    });

    try {
      await this.s3Client.send<PutObjectCommandInput, PutObjectCommandOutput>(
        command,
      );
    } catch (err: any) {
      throw err;
    }

    return {
      path,
      pathWithFilename: key,
      filename: filename,
      completedUrl: `${this.assetUrl}/${key}`,
      baseUrl: this.baseUrl,
      mime,
    };
  }

  async deleteItemInBucket(filename: string): Promise<void> {
    const command: DeleteObjectCommand = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: filename,
    });

    try {
      await this.s3Client.send<
        DeleteObjectCommandInput,
        DeleteObjectCommandOutput
      >(command);
      return;
    } catch (err: any) {
      throw err;
    }
  }

  async deleteItemsInBucket(
    filenames: string[],
    bucket?: string,
  ): Promise<void> {
    const keys: ObjectIdentifier[] = filenames.map((val: string) => ({
      Key: val,
    }));
    const command: DeleteObjectsCommand = new DeleteObjectsCommand({
      Bucket: bucket || this.bucket,
      Delete: {
        Objects: keys,
      },
    });

    try {
      await this.s3Client.send<
        DeleteObjectsCommandInput,
        DeleteObjectsCommandOutput
      >(command);
      return;
    } catch (err: any) {
      throw err;
    }
  }

  //custom
  async listAllItemInBucket({
    bucket,
    prefix,
  }: {
    bucket?: string;
    prefix?: string;
  } = {}): Promise<AwsS3SerializationCustom[]> {
    const command: ListObjectsV2Command = new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix,
    });
    try {
      const listItems: ListObjectsV2Output = await this.s3Client.send<
        ListObjectsV2CommandInput,
        ListObjectsV2CommandOutput
      >(command);

      const mapList: AwsS3SerializationCustom[] | any =
        listItems.Contents &&
        listItems?.Contents?.map((val: _Object) => {
          if (val.Key) {
            const lastIndex: number = val.Key.lastIndexOf('/');
            const path: string = val.Key.substring(0, lastIndex);
            const filename: string = val.Key.substring(
              lastIndex + 1,
              val.Key.length,
            );
            const mime: string = filename
              .substring(filename.lastIndexOf('.') + 1, filename.length)
              .toLocaleUpperCase();

            return {
              path,
              pathWithFilename: val.Key,
              filename: filename,
              completedUrl: `${this.baseUrl}/${val.Key}`,
              baseUrl: this.baseUrl,
              mime,
              lastModified: val.LastModified,
            };
          }
          return undefined;
        });

      return mapList;
    } catch (err: any) {
      throw err;
    }
  }

  async deleteBackupItemsInBucket(
    filenames: string[],
    bucket: string,
  ): Promise<void> {
    const keys: ObjectIdentifier[] = filenames.map((val: string) => ({
      Key: val,
    }));
    const command: DeleteObjectsCommand = new DeleteObjectsCommand({
      Bucket: bucket,
      Delete: {
        Objects: keys,
      },
    });

    try {
      await this.s3Client.send<
        DeleteObjectsCommandInput,
        DeleteObjectsCommandOutput
      >(command);
      return;
    } catch (err: any) {
      throw err;
    }
  }

  async getSignedUrl(
    key: string,
    expires: number = 5 * 60,
    bucket?: string,
  ): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: bucket || this.bucket,
      Key: key,
    });

    try {
      const signedUrl = await getSignedUrl(this.s3Client, command, {
        expiresIn: expires,
      });
      return signedUrl;
    } catch (error) {
      console.error('Error generating signed URL', error);
      throw new Error('Failed to generate signed URL');
    }
  }

  async generateVideoUploadUrl(
    key: string,
    expires: number = 5 * 60,
    bucket?: string,
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: bucket || this.bucket,
      Key: key,
      ContentType: 'video/mp4',
    });

    const signedUrl = await getSignedUrl(this.s3Client, command, {
      expiresIn: expires,
    });

    return signedUrl;
  }

  async generatePresignedPost(
    key: string,
    expires: number = 5 * 60,
    bucket?: string,
  ): Promise<any> {
    const presignedPost = await createPresignedPost(this.s3Client, {
      Bucket: (bucket || this.bucket) as string,
      Key: key,
      Expires: expires, // 10 minutes
      Conditions: [
        ['content-length-range', 0, 10 * 1024 * 1024], // Max 10MB
        ['starts-with', '$Content-Type', 'video/'],
      ],
    });

    return presignedPost;
  }
}
