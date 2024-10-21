import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTheaterRoomDto } from './dto/create-theater-room.dto';
import { UpdateTheaterRoomDto } from './dto/update-theater-room.dto';
import { TheaterRoom } from './entities/theater-room.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Seat } from '../seat/entities/seat.entity';

@Injectable()
export class TheaterRoomService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(TheaterRoom)
    private readonly theaterRoomRepository: Repository<TheaterRoom>,
  ) {}

  async create(createTheaterRoomDto: CreateTheaterRoomDto) {
    const seatArr = new Array<Seat>();
    let theaterRoom = new TheaterRoom();
    theaterRoom.capacity =
      createTheaterRoomDto.numOfRows * createTheaterRoomDto.numOfSeatsPerRow;
    theaterRoom.numOfRows = createTheaterRoomDto.numOfRows;
    theaterRoom.numOfSeatsPerRow = createTheaterRoomDto.numOfSeatsPerRow;
    theaterRoom.roomNumber = +createTheaterRoomDto.roomNumber;
    theaterRoom.isActive = createTheaterRoomDto.isActive;

    for (let i = 0; i < createTheaterRoomDto.numOfRows; i++) {
      let row = String.fromCharCode('A'.charCodeAt(0) + i);
      for (let j = 1; j <= createTheaterRoomDto.numOfSeatsPerRow; j++) {
        let seat = new Seat();
        seat.row = row;
        seat.number = j;
        seat.seatNumber = seat.row + seat.number;
        seatArr.push(seat);
      }
    }
    theaterRoom.seats = seatArr;
    return await this.dataSource.manager.save(theaterRoom);
  }

  findAll() {
    return this.theaterRoomRepository.find();
  }

  findOne(id: number) {
    return this.theaterRoomRepository.findOne({
      where: { id },
      relations: {
        seats: true,
      },
      order: {
        seats: {
          seatNumber: 'ASC',
        },
      },
    });
  }

  async update(id: number, updateTheaterRoomDto: UpdateTheaterRoomDto) {
    let theaterRoom = await this.theaterRoomRepository.findOne({
      where: { id },
    });

    if (!theaterRoom) {
      throw new NotFoundException('Theater Room not found');
    }
    const newSeat = new Array<Seat>();
    let createdSeatSet = await this.dataSource.manager
      .find(Seat, {
        where: { theaterRoom: { id } },
        select: {
          id: true,
          seatNumber: true,
        },
      })
      .then((seats) => {
        return new Map(
          seats.map((seat) => {
            return [seat.seatNumber, seat.id];
          }),
        );
      });

    console.log('createdSeatSet', createdSeatSet);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.update(TheaterRoom, id, {
        isActive: updateTheaterRoomDto.isActive,
        roomNumber: updateTheaterRoomDto.roomNumber,
        numOfRows: updateTheaterRoomDto.numOfRows,
        numOfSeatsPerRow: updateTheaterRoomDto.numOfSeatsPerRow,
      });

      for (let i = 0; i < updateTheaterRoomDto.numOfRows; i++) {
        let row = String.fromCharCode('A'.charCodeAt(0) + i);
        for (let j = 1; j <= updateTheaterRoomDto.numOfSeatsPerRow; j++) {
          let seat = new Seat();
          seat.row = row;
          seat.number = j;
          seat.seatNumber = seat.row + seat.number;
          if (!createdSeatSet.has(seat.seatNumber)) {
            seat.theaterRoom = theaterRoom;
            newSeat.push(seat);
          } else {
            createdSeatSet.delete(seat.seatNumber);
          }
        }
      }
      await queryRunner.manager.save(Seat, newSeat);
      await queryRunner.manager
        .createQueryBuilder()
        .update(Seat)
        .set({ isActive: false })
        .where({ id: In([...createdSeatSet.values()]) })
        .execute();

      await queryRunner.commitTransaction();
    } catch (error) {
      console.log('error', error);
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
