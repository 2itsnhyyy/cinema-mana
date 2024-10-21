import { Injectable } from '@nestjs/common';
import { CreateShowtimeSeatDto } from './dto/create-showtime-seat.dto';
import { UpdateShowtimeSeatDto } from './dto/update-showtime-seat.dto';
import { ShowtimeSeat } from './entities/showtime-seat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, DataSource } from 'typeorm';
import { SeatType } from '../shared/enum';
import { Showtime } from '../showtime/entities/showtime.entity';

@Injectable()
export class ShowtimeSeatService {
  constructor(
    @InjectRepository(ShowtimeSeat)
    private readonly showtimeSeatRepository: Repository<ShowtimeSeat>,

    private dataSource: DataSource,
  ) {}

  create(createShowtimeSeatDto: CreateShowtimeSeatDto) {
    return 'This action adds a new showtimeSeat';
  }

  findAll(showtimeId: number) {
    return this.showtimeSeatRepository.find({
      where: { showtimeId },
      order: { seatNumber: 'ASC' },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} showtimeSeat`;
  }

  async update(id: number, updateShowtimeSeatDto: UpdateShowtimeSeatDto) {
    let showtime = await this.dataSource.manager.findOne(Showtime, {
      where: { id },
    });

    return this.showtimeSeatRepository.update(
      {
        id: In(updateShowtimeSeatDto.showtimeSeatIds),
        showtimeId: id,
      },
      {
        type: updateShowtimeSeatDto.seatType,
        price:
          updateShowtimeSeatDto.seatType === SeatType.VIP
            ? +showtime.vipPrice
            : +showtime.economyPrice,
      },
    );
  }

  remove(id: number) {
    return `This action removes a #${id} showtimeSeat`;
  }
}
