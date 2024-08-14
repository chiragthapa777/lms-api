import { faker } from '@faker-js/faker';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class AwsS3Serialization {
  @ApiProperty({
    required: true,
    nullable: false,
    example: faker.system.directoryPath(),
  })
  @Type(() => String)
  path: string;

  @ApiProperty({
    required: true,
    nullable: false,
    example: faker.system.filePath(),
  })
  @Type(() => String)
  pathWithFilename: string;

  @ApiProperty({
    required: true,
    nullable: false,
    example: faker.system.fileName(),
  })
  @Type(() => String)
  filename: string;

  @ApiProperty({
    required: true,
    nullable: false,
    example: `${faker.internet.url()}/${faker.system.filePath()}`,
  })
  @Type(() => String)
  completedUrl: string;

  @ApiProperty({
    required: true,
    nullable: false,
    example: faker.internet.url(),
  })
  @Type(() => String)
  baseUrl: string | undefined;

  @ApiProperty({
    required: true,
    nullable: false,
    example: faker.system.mimeType(),
  })
  @Type(() => String)
  mime: string;
}

export class AwsS3SerializationCustom extends PickType(AwsS3Serialization, [
  'path',
  'pathWithFilename',
  'filename',
  'completedUrl',
  'baseUrl',
  'mime',
] as const) {
  @ApiProperty({
    nullable: false,
    example: faker.date.future(),
  })
  lastModified: string;
}
