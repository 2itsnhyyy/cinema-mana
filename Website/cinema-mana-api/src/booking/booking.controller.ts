import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingFilterDto } from './dto/booking-filter.dto';
import { ResponseMessage } from '../decorator/response-message.decorator';
import { AttachEmployeeToBodyDecorator } from '../shared/decorator';
import { AuthGuard } from '../auth/auth.guard';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @HttpCode(201)
  @UseGuards(AuthGuard)
  @ResponseMessage('Booking created successfully')
  create(
    @AttachEmployeeToBodyDecorator()
    @Body()
    createBookingDto: CreateBookingDto,
  ) {
    return this.bookingService.create(createBookingDto);
  }

  @Get()
  @ResponseMessage('Get all bookings successfully')
  findAll(@Query() bookingFilterDto: BookingFilterDto) {
    return this.bookingService.findAll(bookingFilterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBookingDto: UpdateBookingDto) {
    return this.bookingService.update(+id, updateBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingService.remove(+id);
  }
}
