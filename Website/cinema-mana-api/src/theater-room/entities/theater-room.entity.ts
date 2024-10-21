import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Showtime } from '../../showtime/entities/showtime.entity';
import { Seat } from '../../seat/entities/seat.entity';

@Entity({ name: 'theater_rooms' })
@Unique(['roomNumber'])
export class TheaterRoom {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  roomNumber: number;

  capacity: number;

  @Column()
  numOfRows: number;
  @Column()
  numOfSeatsPerRow: number;

  @Column()
  isActive: boolean;

  @OneToMany(() => Showtime, (showtime) => showtime.theaterRoom)
  showtimes: Showtime[];

  @OneToMany(() => Seat, (seat) => seat.theaterRoom, {
    cascade: ['insert', 'update'],
  })
  seats: Seat[];
}
