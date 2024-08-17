import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentRepositoryModule } from './repositories/payment.repository.module';

@Module({
  providers: [PaymentService],
  exports: [PaymentService],
  imports: [PaymentRepositoryModule],
})
export class PaymentModule {}
