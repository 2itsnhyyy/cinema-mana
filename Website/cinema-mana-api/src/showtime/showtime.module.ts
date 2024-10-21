import { Module } from '@nestjs/common';
import { ShowtimeService } from './showtime.service';
import { ShowtimeController } from './showtime.controller';
import { ShowtimeSeatService } from '../showtime-seat/showtime-seat.service';
import { ShowtimeSeatModule } from '../showtime-seat/showtime-seat.module';

@Module({
  imports: [ShowtimeSeatModule],
  controllers: [ShowtimeController],
  providers: [ShowtimeService],
})
export class ShowtimeModule {}
