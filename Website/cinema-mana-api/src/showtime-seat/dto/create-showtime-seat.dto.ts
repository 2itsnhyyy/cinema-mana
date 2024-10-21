import { IsEnum } from 'class-validator';
import { SeatType } from '../../shared/enum';

export class CreateShowtimeSeatDto {
  @IsEnum(SeatType, {
    message: `seatType must be a valid enum value ${Object.values(SeatType)}`,
  })
  seatType: SeatType;
}
