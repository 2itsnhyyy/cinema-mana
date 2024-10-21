import { PartialType } from '@nestjs/mapped-types';
import { CreateSeatDto } from './create-seat.dto';
import { Type } from 'class-transformer';
import { IsArray, IsInt } from 'class-validator';

export class UpdateSeatDto extends PartialType(CreateSeatDto) {
  @Type(() => Number)
  @IsInt({ each: true })
  @IsArray()
  seatIds: number[];
}
