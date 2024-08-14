import { Column } from 'typeorm';
import { IBookingBaseInterface } from '../../interfaces/booking.base.interface';
import { DatabaseBaseEntity } from './BaseEntity';
import { Expose } from 'class-transformer';
import { ALL_GROUP } from '../../constant/serialization-group.constant';

export class BookingBaseEntity
  extends DatabaseBaseEntity
  implements IBookingBaseInterface
{
  @Column({
    name: 'from',
    nullable: true,
  })
  @Expose({ groups: ALL_GROUP })
  from: Date;

  @Column({
    name: 'to',
    nullable: true,
  })
  @Expose({ groups: ALL_GROUP })
  to: Date;

  @Column({
    name: 'price',
    nullable: true,
  })
  @Expose({ groups: ALL_GROUP })
  price: number;

  @Column({
    name: 'total',
    nullable: true,
  })
  @Expose({ groups: ALL_GROUP })
  total: number;

  @Column({
    name: 'grand_total',
    nullable: true,
  })
  @Expose({ groups: ALL_GROUP })
  grandTotal: number;
}
