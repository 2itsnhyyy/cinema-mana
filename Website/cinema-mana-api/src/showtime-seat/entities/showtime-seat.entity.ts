import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Seat } from '../../seat/entities/seat.entity';
import { Showtime } from '../../showtime/entities/showtime.entity';
import { SeatStatus, SeatType } from '../../shared/enum';

import { EntitySubscriberInterface, EventSubscriber } from 'typeorm';

@EventSubscriber()
export class ShowtimeSeatSubscriber implements EntitySubscriberInterface<ShowtimeSeat> {
  listenTo() {
    return ShowtimeSeat;
  }

  async afterLoad(seat: ShowtimeSeat): Promise<void> {
    seat.row = seat.seatNumber[0];
    seat.number = parseInt(seat.seatNumber.slice(1));
  }
}

@Entity({ name: 'showtime_seats' })
@Index(['showtimeId', 'seatNumber'], { unique: true })
export class ShowtimeSeat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Showtime, (showtime) => showtime.showtimeSeats)
  showtime: Showtime;

  @RelationId((showtimeSeat: ShowtimeSeat) => showtimeSeat.showtime)
  @Column({ type: 'int' })
  showtimeId?: number;

  @ManyToOne(() => Seat, null, { cascade: true })
  seat: Seat;

  @RelationId((showtimeSeat: ShowtimeSeat) => showtimeSeat.seat)
  @Column({ type: 'int' })
  seatId?: number;

  row: string;
  number: number;

  @Column({ type: 'varchar', length: 5 })
  seatNumber: string;

  @Column()
  price: number;

  @Column({ type: 'enum', enum: SeatStatus, default: SeatStatus.AVAILABLE })
  status: SeatStatus;

  @Column({ type: 'enum', enum: SeatType, default: SeatType.ECONOMY })
  type: SeatType;

  reload(): void {
    this.row = this.seatNumber[0];
    this.number = +this.seatNumber.slice(1);
  }
}
