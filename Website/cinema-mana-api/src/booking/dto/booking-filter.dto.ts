import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional } from 'class-validator';
import { IsKeyExist } from '../../decorator/key-exist.decorator';
import { Employee } from '../../employee/entities/employee.entity';

export class BookingFilterDto {
  @IsDateString()
  @IsOptional()
  date?: Date;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  movieId?: number;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  customerId?: number;
}
