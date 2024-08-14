import { ApiProperty } from '@nestjs/swagger';
import { IFile } from '../interfaces/file.interface';

export class FileBodyDto {
  @ApiProperty({
    type: 'string',
    example: '60f1b0b0c9b0f3b3e8b0b3b3',
  })
  id: string;
  @ApiProperty({
    type: 'string',
    example: 'gomygo-operator or gomygo-agents',
  })
  bucket: string;
  @ApiProperty({
    type: 'string',
    example: 'agent or org',
  })
  module: string;
}

export class CompleteBody extends FileBodyDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: IFile;
}
