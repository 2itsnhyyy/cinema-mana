import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Movie } from '../../movie/entities/movie.entity';
import { ShowtimeStatus } from '../../shared/enum';
import { ShowtimeSeat } from '../../showtime-seat/entities/showtime-seat.entity';
import { TheaterRoom } from '../../theater-room/entities/theater-room.entity';

@Entity({ name: 'showtimes' })
export class Showtime {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => TheaterRoom, (theaterRoom) => theaterRoom.showtimes, {
    nullable: false,
  })
  theaterRoom: TheaterRoom;

  @RelationId((showtime: Showtime) => showtime.theaterRoom)
  @Column({ type: 'int' })
  theaterRoomId?: number;

  @ManyToOne(() => Movie, null, { nullable: false })
  movie: Movie;

  @RelationId((showtime: Showtime) => showtime.movie)
  @Column({ type: 'int' })
  movieId?: number;

  @Column()
  startTime: Date;

  @Column()
  endTime: Date;

  status: ShowtimeStatus;

  @OneToMany(() => ShowtimeSeat, (showtimeSeat) => showtimeSeat.showtime, {
    cascade: true,
  })
  showtimeSeats: ShowtimeSeat[];

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 50000 })
  economyPrice: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 75000})
  vipPrice: number;
}
