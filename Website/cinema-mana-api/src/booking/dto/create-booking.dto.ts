import { Type } from 'class-transformer';
import { IsInt, IsObject } from 'class-validator';
import { IsKeyExist } from '../../decorator/key-exist.decorator';
import { Employee } from '../../employee/entities/employee.entity';


export class CreateBookingDto {
  // @ManyToOne(() => Voucher)
  // Voucher: Voucher;

  // @ManyToOne(() => Customer)
  // Customer: Customer;

  @IsInt()
  @Type(() => Number)
  employeeId: number;

  @IsInt()
  @Type(() => Number)
  showtimeId: number;

  @IsInt({ each: true })
  @Type(() => Number)
  showtimeSeatIds: number[];

  @IsInt()
  @Type(() => Number)
  customerId: number;
}
