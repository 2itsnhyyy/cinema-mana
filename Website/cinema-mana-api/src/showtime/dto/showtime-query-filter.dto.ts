import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional } from 'class-validator';
import { ShowtimeStatus } from '../../shared/enum';

export class ShowtimeQueryFilterDto {
  @IsOptional()
  @IsDateString()
  date?: Date;

  @IsOptional()
  @IsEnum(ShowtimeStatus, { message: 'Invalid status' })
  status?: ShowtimeStatus;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  movieId?: number;
}
