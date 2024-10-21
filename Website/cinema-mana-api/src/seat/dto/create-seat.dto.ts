import { IsBoolean, IsEnum } from 'class-validator';
import { SeatType } from '../../shared/enum';

export class CreateSeatDto {
  @IsBoolean()
  isActive: boolean;

  @IsEnum(SeatType, {
    message: `Invalid seat type. Should be one of these: ${Object.values(SeatType).join(', ')}`,
  })
  seatType: SeatType;
}
