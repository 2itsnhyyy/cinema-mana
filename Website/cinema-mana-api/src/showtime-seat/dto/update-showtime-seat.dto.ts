import { PartialType } from '@nestjs/mapped-types';
import { CreateShowtimeSeatDto } from './create-showtime-seat.dto';
import { IsArray, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateShowtimeSeatDto extends CreateShowtimeSeatDto {
  @Type(() => Number)
  @IsInt({ each: true })
  @IsArray()
  showtimeSeatIds: number[];
}
