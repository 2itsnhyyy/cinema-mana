import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateTheaterRoomDto } from './create-theater-room.dto';
import { IsInt, IsNotEmpty, IsNumber } from 'class-validator';
import { IsUnique } from '../../decorator/is-unique.decorator';
import { TheaterRoom } from '../entities/theater-room.entity';
import { Type } from 'class-transformer';

export class UpdateTheaterRoomDto extends PartialType(
  OmitType(CreateTheaterRoomDto, ['roomNumber'] as const),
) {
  @IsInt()
  @Type(() => Number)
  @IsUnique({
    entityClass: TheaterRoom,
    column: 'roomNumber',
    notEqualBy: 'id',
  })
  roomNumber: number;

  @IsNotEmpty()
  id: number;
}
