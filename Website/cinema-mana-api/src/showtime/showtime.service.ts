import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import moment from 'moment';
import { DataSource, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Movie } from '../movie/entities/movie.entity';
import { Seat } from '../seat/entities/seat.entity';
import { SeatStatus, SeatType, ShowtimeStatus } from '../shared/enum';
import { ShowtimeSeat } from '../showtime-seat/entities/showtime-seat.entity';
import { CreateShowtimeDto } from './dto/create-showtime.dto';
import { ShowtimeQueryFilterDto } from './dto/showtime-query-filter.dto';
import { UpdateShowtimeDto } from './dto/update-showtime.dto';
import { Showtime } from './entities/showtime.entity';
import { ShowtimeSeatService } from '../showtime-seat/showtime-seat.service';

@Injectable()
export class ShowtimeService {
  constructor(
    private dataSource: DataSource,
    private readonly showtimeSeatService: ShowtimeSeatService,
  ) {}

  async create(createShowtimeDto: CreateShowtimeDto) {
    let movie = await this.dataSource.manager.findOne(Movie, {
      where: { id: createShowtimeDto.movieId },
      select: ['id', 'duration'],
    });

    if (!movie) {
      throw new NotFoundException('Movie not found');
    }
    let endTime = moment(createShowtimeDto.startTime)
      .add(movie.duration, 'm')
      .toDate();

    let isOverlapped = await this.dataSource.manager.exists(Showtime, {
      where: {
        theaterRoomId: createShowtimeDto.theaterRoomId,
        movieId: createShowtimeDto.movieId,
        startTime: LessThanOrEqual(endTime),
        endTime: MoreThanOrEqual(createShowtimeDto.startTime),
      },
    });
    if (isOverlapped) throw new BadRequestException('Showtime is overlapped');

    let seats = await this.dataSource.manager.find(Seat, {
      where: {
        theaterRoomId: createShowtimeDto.theaterRoomId,
        isActive: true,
      },
    });
    if (seats.length === 0) {
      throw new BadRequestException('Theater room has no seats');
    }

    let showtimeSeats = seats.map((seat) => {
      let showtimeSeat = new ShowtimeSeat();
      showtimeSeat.seat = seat;
      showtimeSeat.status = SeatStatus.AVAILABLE;
      showtimeSeat.type = seat.type;
      showtimeSeat.seatNumber = seat.seatNumber;
      showtimeSeat.reload();
      if (seat.type === SeatType.VIP) {
        showtimeSeat.price = createShowtimeDto.vipPrice;
      } else {
        showtimeSeat.price = createShowtimeDto.economyPrice;
      }

      return showtimeSeat;
    });

    let queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      let showtime = new Showtime();
      showtime.movieId = createShowtimeDto.movieId;
      showtime.startTime = createShowtimeDto.startTime;
      showtime.economyPrice = createShowtimeDto.economyPrice;
      showtime.vipPrice = createShowtimeDto.vipPrice;
      showtime.endTime = endTime;
      showtime.theaterRoomId = createShowtimeDto.theaterRoomId;
      showtime.showtimeSeats = showtimeSeats;
      await queryRunner.manager.save(showtime);
      await queryRunner.commitTransaction();
    } catch (error) {
      console.log('error', error);
      await queryRunner.rollbackTransaction();

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  findAll(filter: ShowtimeQueryFilterDto) {
    let query = this.dataSource.manager.createQueryBuilder(
      Showtime,
      'showtime',
    );
    if (filter.date) {
      query.where('DATE(showtime.startTime) = :date', {
        date: moment(filter.date).format('YYYY-MM-DD'),
      });
    }
    if (filter.movieId) {
      query.andWhere('showtime.movieId = :movieId', {
        movieId: filter.movieId,
      });
    }
    if (filter.status) {
      let now = new Date();
      switch (filter.status) {
        case ShowtimeStatus.NEW:
          query.andWhere('showtime.startTime > :now', {
            now,
          });
          break;
        case ShowtimeStatus.PLAYING:
          query.andWhere('showtime.startTime <= :now', {
            now,
          });
          query.andWhere('showtime.endTime >= :now', {
            now,
          });
          break;
        default:
          query.andWhere('showtime.endTime < :now', {
            now,
          });
          break;
      }
    }

    query
      .leftJoinAndSelect('showtime.movie', 'movie')
      .leftJoinAndSelect('showtime.theaterRoom', 'theaterRoom')

    return query.getMany();
  }

  async findOne(id: number) {
    let showtime = await this.dataSource.manager.findOne(Showtime, {
      where: { id },
      relations: ['movie', 'theaterRoom'],
    });

    let showtimeSeats = await this.showtimeSeatService.findAll(id);
    showtime.showtimeSeats = showtimeSeats;
    return showtime;
  }

  update(id: number, updateShowtimeDto: UpdateShowtimeDto) {
    return `This action updates a #${id} showtime`;
  }

  remove(id: number) {
    return this.dataSource.manager.softDelete(Showtime, { id });
  }
}
