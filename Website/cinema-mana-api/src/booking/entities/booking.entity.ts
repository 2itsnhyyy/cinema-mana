import { IsCurrency, IsDate, IsNotEmpty } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Employee } from '../../employee/entities/employee.entity';
import { Showtime } from '../../showtime/entities/showtime.entity';
import { Ticket } from '../../ticket/entities/ticket.entity';
import { Customer } from '../../customer/entities/customer.entity';

@Entity()
export default class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(() => Voucher)
  // Voucher: Voucher;

  @ManyToOne(() => Customer)
  customer: Customer;
  @Column()
  customerId: number;

  @ManyToOne(() => Employee)
  employee: Employee;
  @Column()
  employeeId: number;

  @ManyToOne(() => Showtime)
  showtime: Showtime;
  @Column()
  showtimeId: number;

  @OneToMany(() => Ticket, (ticket) => ticket.booking, {cascade: true})
  tickets: Ticket[];

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  finalPrice: number;
}
