import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUrl,
} from 'class-validator';

export class CourseCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  price?: number;

  @ApiProperty()
  @IsString()
  category?: string;

  @ApiProperty()
  @IsUrl()
  @IsNotEmpty()
  photoLink?: string;
}

export class CourseUpdateDto extends PartialType(CourseCreateDto) {}
export class CourseRateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  review: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  rating: number;
}
export class CourseChapterViewDto {
  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  completed: boolean;
}
export class CourseEnrollDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  transactionId: string;
}
