import {
  IsBoolean,
  IsDateString,
  IsEmpty,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export enum QueryType {
  SHOWING = 'SHOWING',
  ALL = 'ALL',
}

export class MovieQueryDto {
  @IsOptional()
  @IsString()
  queryType?: QueryType = QueryType.ALL;

  @IsOptional()
  @IsDateString()
  date?: Date;
}
