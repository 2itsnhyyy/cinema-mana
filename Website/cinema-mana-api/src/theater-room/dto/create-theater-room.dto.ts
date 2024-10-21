import {
  IsString,
  IsNumber,
  IsBoolean,
  Min,
  Max,
  IsInt,
} from 'class-validator';
import { IsUnique } from '../../decorator/is-unique.decorator';
import { TheaterRoom } from '../entities/theater-room.entity';
import { Type } from 'class-transformer';

export class CreateTheaterRoomDto {
  @IsInt()
  @Type(() => Number)
  @IsUnique({ entityClass: TheaterRoom, column: 'roomNumber' })
  roomNumber: number;

  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(26)
  numOfRows: number;

  @IsInt()
  @Type(() => Number)
  @Min(1)
  numOfSeatsPerRow: number;

  @IsBoolean()
  isActive: boolean;
}
