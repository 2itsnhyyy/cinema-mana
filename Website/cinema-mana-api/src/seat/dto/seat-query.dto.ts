import { IsNumber } from 'class-validator';

class SeatQueryDto {
  @IsNumber()
  theaterRoomId?: number;
}
