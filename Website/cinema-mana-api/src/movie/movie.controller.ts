import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ResponseMessage } from '../decorator/response-message.decorator';
import FileServiceAbtract from '../services/files/upload-file.abstract.service';
import { AttachFieldParamsToBodyDecorator } from '../shared/decorator';
import { EntityIdValidationPipe } from '../shared/validation';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie } from './entities/movie.entity';
import { MovieService } from './movie.service';
import { MovieQueryDto } from './dto/movie-query.dto';

@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Post()
  @HttpCode(201)
  @ResponseMessage('Movie created successfully')
  async create(@Body() createMovieDto: CreateMovieDto) {
    console.log(createMovieDto);
    return await this.movieService.create(createMovieDto);
  }

  @Get()
  @ResponseMessage('Get all movies successfully')
  async findAll(@Query() query: MovieQueryDto) {
    return await this.movieService.findAll(query);
  }

  @Get(':id')
  @ResponseMessage('Get movie by id successfully')
  async findOne(
    @Param(
      'id',
      EntityIdValidationPipe({
        entityClass: Movie,
        errorNotFoundMessage: 'Movie not found',
      }),
    )
    id: string,
  ) {
    return await this.movieService.findOne(+id);
  }

  @Patch(':id')
  @ResponseMessage('Movie updated successfully')
  async update(
    @Param(
      'id',
      EntityIdValidationPipe({
        entityClass: Movie,
        errorNotFoundMessage: 'Movie not found',
      }),
    )
    id: string,
    @AttachFieldParamsToBodyDecorator('id')
    @Body()
    updateMovieDto: UpdateMovieDto,
  ) {
    return await this.movieService.update(+id, updateMovieDto);
  }

  @Delete(':id')
  @ResponseMessage('Movie deleted successfully')
  remove(
    @Param(
      'id',
      EntityIdValidationPipe({
        entityClass: Movie,
        errorNotFoundMessage: 'Movie not found',
      }),
    )
    id: string,
  ) {
    return this.movieService.remove(+id);
  }
}
