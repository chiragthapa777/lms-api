import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class PaymentCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  remark?: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  userId?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  transactionId?: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount?: number;
}
export class PaymentUpdateDto extends PartialType(PaymentCreateDto) {}
