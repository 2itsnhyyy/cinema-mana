import { Module } from '@nestjs/common';
import { ShowtimeSeatService } from './showtime-seat.service';
import { ShowtimeSeatController } from './showtime-seat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShowtimeSeat } from './entities/showtime-seat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShowtimeSeat])],
  controllers: [ShowtimeSeatController],
  providers: [ShowtimeSeatService],
  exports: [ShowtimeSeatService],
})
export class ShowtimeSeatModule {}
