import {
  IsNotEmpty,
  IsNumber,
  IsDate,
  Min,
  IsDateString,
  IsInt,
} from 'class-validator';
import { IsKeyExist } from '../../decorator/key-exist.decorator';
import { Movie } from '../../movie/entities/movie.entity';
import { TheaterRoom } from '../../theater-room/entities/theater-room.entity';
import { Type } from 'class-transformer';

export class CreateShowtimeDto {
  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  @IsKeyExist({ entityClass: TheaterRoom, column: 'id' })
  theaterRoomId: number;

  @IsNotEmpty()
  @IsInt()
  @Type(() => Number)
  @IsKeyExist({ entityClass: Movie, column: 'id' })
  movieId: number;

  @IsNotEmpty()
  @IsDateString()
  startTime: Date;

  @IsNumber()
  @Min(0)
  economyPrice: number = 45000;

  @IsNumber()
  @Min(0)
  vipPrice: number = 75000;
}
