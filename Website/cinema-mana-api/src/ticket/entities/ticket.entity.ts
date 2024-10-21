import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import Booking from '../../booking/entities/booking.entity';
import { ShowtimeSeat } from '../../showtime-seat/entities/showtime-seat.entity';

@Entity({ name: 'tickets' })
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => ShowtimeSeat, null, { cascade: true })
  @JoinColumn()
  showtimeSeat: ShowtimeSeat;
  @Column()
  showtimeSeatId: number;

  @Column()
  seatNumber: string;

  @ManyToOne(() => Booking, (booking) => booking.tickets)
  booking: Booking;

  @Column()
  price: number;
}
