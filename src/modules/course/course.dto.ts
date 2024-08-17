import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator';

export class CourseCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title?: string;

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
