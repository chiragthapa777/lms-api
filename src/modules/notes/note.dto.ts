import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class NoteCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  userId?: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  chapterId?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content?: string;
}

export class NoteUpdateDto extends PartialType(NoteCreateDto) {}
