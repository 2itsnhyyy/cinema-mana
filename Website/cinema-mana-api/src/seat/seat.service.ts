import { Injectable } from '@nestjs/common';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';
import { Seat } from './entities/seat.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class SeatService {
  constructor(
    @InjectRepository(Seat)
    private seatRepository: Repository<Seat>,
  ) {}

  findAll(roomId: number) {
    return this.seatRepository.find({
      where: { theaterRoomId: roomId },
      order: { theaterRoomId: 'ASC', seatNumber: 'ASC' },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} seat`;
  }

  update(id: number, updateSeatDto: UpdateSeatDto) {
    return this.seatRepository.update(
      {
        id: In(updateSeatDto.seatIds),
        theaterRoomId: id,
      },
      {
        isActive: updateSeatDto.isActive,
        type: updateSeatDto.seatType,
      }
    );
  }
}
