import { IsNotEmpty, IsString } from 'class-validator';

export class FilenameParamDto {
  @IsNotEmpty()
  @IsString()
  filename: string;
}
