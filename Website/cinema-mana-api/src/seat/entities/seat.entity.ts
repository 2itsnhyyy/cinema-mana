import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId
} from 'typeorm';
import { SeatType } from '../../shared/enum';
import { TheaterRoom } from '../../theater-room/entities/theater-room.entity';

@Entity({ name: 'seats' })
@Index(['theaterRoom', 'seatNumber'], { unique: true })
export class Seat {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TheaterRoom, (theaterRoom) => theaterRoom.seats, {
    nullable: false,
  })
  theaterRoom: TheaterRoom;

  @RelationId((seat: Seat) => seat.theaterRoom)
  @Column({ type: 'int', nullable: true })
  theaterRoomId: number;

  row: string;

  number: number;

  @Column({ type: 'varchar', length: 5 })
  seatNumber: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'enum', enum: SeatType, default: SeatType.ECONOMY })
  type: SeatType;
}

