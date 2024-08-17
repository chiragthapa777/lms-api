import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ChapterCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  videoLink?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  index?: number;
}

export class ChapterUpdateDto extends PartialType(ChapterCreateDto) {}
