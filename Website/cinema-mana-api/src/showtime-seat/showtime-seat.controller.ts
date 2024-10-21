import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UpdateShowtimeSeatDto } from './dto/update-showtime-seat.dto';
import { ShowtimeSeatService } from './showtime-seat.service';
import { IsInt } from 'class-validator';

@Controller('showtimes/:showtimeId/seats')
export class ShowtimeSeatController {
  constructor(private readonly showtimeSeatService: ShowtimeSeatService) {}

  @Get()
  findAll(@Param('showtimeId') showtimeId: string) {
    return this.showtimeSeatService.findAll(+showtimeId);
  }

  @Patch()
  update(
    @Param('showtimeId') showtimeId: number,
    @Body() updateShowtimeSeatDto: UpdateShowtimeSeatDto,
  ) {
    return this.showtimeSeatService.update(+showtimeId, updateShowtimeSeatDto);
  }
}
