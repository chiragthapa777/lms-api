import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from '../entities/payment.entity';
import { PaymentRepository } from './payment.repository';

@Module({
  providers: [PaymentRepository],
  exports: [PaymentRepository],
  controllers: [],
  imports: [TypeOrmModule.forFeature([PaymentEntity])],
})
export class PaymentRepositoryModule {}
