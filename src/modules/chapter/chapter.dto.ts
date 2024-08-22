import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

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
  @IsNotEmpty()
  courseId?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  videoLink?: string;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  index?: number;
}

export class ChapterUpdateDto extends PartialType(ChapterCreateDto) {}
