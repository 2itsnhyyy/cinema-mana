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

export class CreateMovieDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsInt()
  @Min(0)
  duration: number;

  @IsDateString()
  releaseDate: Date;

  @IsString()
  @IsUrl({}, { message: 'Company URL is not valid.' })
  poster: string;

  @IsBoolean()
  isPublished: boolean = false;
}
