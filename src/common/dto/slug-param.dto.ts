import { IsNotEmpty, MinLength } from 'class-validator';

export class SlugParamDto {
  @IsNotEmpty()
  @MinLength(1)
  slug: string;
}
