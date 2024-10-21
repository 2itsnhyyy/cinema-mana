import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SeatService } from './seat.service';
import { CreateSeatDto } from './dto/create-seat.dto';
import { UpdateSeatDto } from './dto/update-seat.dto';

@Controller('theater-rooms/:roomId/seats')
export class SeatController {
  constructor(private readonly seatService: SeatService) {}

  @Get()
  findAll(@Param('roomId') roomId: string) {
    return this.seatService.findAll(+roomId);
  }

  @Patch()
  update(@Param('roomId') id: number, @Body() updateSeatDto: UpdateSeatDto) {
    return this.seatService.update(+id, updateSeatDto);
  }
}
