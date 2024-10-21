import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { DataSource, In } from 'typeorm';
import { Employee } from '../employee/entities/employee.entity';
import Booking from './entities/booking.entity';
import { SeatStatus, ShowtimeStatus } from '../shared/enum';
import { Showtime } from '../showtime/entities/showtime.entity';
import { ShowtimeSeat } from '../showtime-seat/entities/showtime-seat.entity';
import { Customer } from '../customer/entities/customer.entity';
import { Ticket } from '../ticket/entities/ticket.entity';
import { BookingFilterDto } from './dto/booking-filter.dto';

@Injectable()
export class BookingService {
  constructor(private readonly dataSource: DataSource) {}

  async create(createBookingDto: CreateBookingDto) {
    let queryRunner = await this.dataSource.createQueryRunner();
    let employee = await queryRunner.manager.findOneBy(Employee, {
      id: createBookingDto.employeeId,
    });
    if (!employee) {
      throw new BadRequestException('Employee not found');
    }

    let customer = await queryRunner.manager.findOneBy(Customer, {
      id: createBookingDto.customerId,
    });
    if (!customer) {
      throw new BadRequestException('Customer not found');
    }

    let showtime = await queryRunner.manager.findOneBy(Showtime, {
      id: createBookingDto.showtimeId,
    });

    if (!showtime) {
      throw new BadRequestException('Showtime not found');
    }
    if (showtime.status === ShowtimeStatus.ENDED) {
      throw new BadRequestException('Showtime has ended');
    }

    let showtimeSeats = await queryRunner.manager.find(ShowtimeSeat, {
      where: {
        showtimeId: showtime.id,
        status: SeatStatus.AVAILABLE,
        id: In(createBookingDto.showtimeSeatIds),
      },
    });
    if(showtimeSeats.length === 0) {
      throw new BadRequestException('No available seats');
    }
    let showtimeSeatSet = new Set(showtimeSeats.map((seat) => seat.id));

    let notAvailableSeats = createBookingDto.showtimeSeatIds.filter(
      (id) => !showtimeSeatSet.has(id),
    );
    if (notAvailableSeats.length > 0) {
      throw new BadRequestException(
        `Seat(s) ${notAvailableSeats.join(', ')} is not available`,
      );
    }

    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.update(
        ShowtimeSeat,
        {
          id: In(createBookingDto.showtimeSeatIds),
        },
        {
          status: SeatStatus.BOOKED,
        },
      );

      let tickets = showtimeSeats.map((seat) => {
        let ticket = new Ticket();
        ticket.showtimeSeatId = seat.id;
        ticket.price = seat.price;
        ticket.seatNumber = seat.seatNumber;
        return ticket;
      });

      let booking = new Booking();
      booking.customer = customer;
      booking.employee = employee;
      booking.showtime = showtime;
      booking.tickets = tickets;
      booking.totalPrice = tickets.reduce(
        (acc, ticket) => acc + ticket.price,
        0,
      );
      booking.finalPrice = booking.totalPrice;
      await queryRunner.manager.save(booking);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  findAll(filter: BookingFilterDto) {
    let query = this.dataSource.manager.createQueryBuilder(Booking, 'booking');

    if (filter.customerId) {
      query.andWhere('booking.customerId = :customerId', {
        customerId: filter.customerId,
      });
    }

    if (filter.date) {
      query.andWhere('DATE(booking.createdAt) = :date', {
        date: filter.date,
      });
    }
    query.leftJoinAndSelect('booking.customer', 'customer');
    query.leftJoinAndSelect('booking.showtime', 'showtime');
    query.leftJoinAndSelect('booking.employee', 'employee');
    query.leftJoinAndSelect('showtime.movie', 'movie'); 
    query.leftJoinAndSelect('booking.tickets', 'ticket');
    query.orderBy('booking.createdAt', 'DESC');
    return query.getMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} booking`;
  }

  update(id: number, updateBookingDto: UpdateBookingDto) {
    return `This action updates a #${id} booking`;
  }

  remove(id: number) {
    return `This action removes a #${id} booking`;
  }
}
