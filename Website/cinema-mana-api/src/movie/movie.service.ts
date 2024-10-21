import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Between, DataSource, In, Repository } from 'typeorm';
import { MovieQueryDto, QueryType } from './dto/movie-query.dto';
import { Showtime } from '../showtime/entities/showtime.entity';
import moment from 'moment';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    private dataSource: DataSource,
  ) {}

  create(createMovieDto: CreateMovieDto) {
    return this.movieRepository.save(createMovieDto);
  }

  async findAll(filter: MovieQueryDto) {
    if (filter.queryType === QueryType.ALL) {
      return this.movieRepository.find();
    }
    let query = this.dataSource.manager.createQueryBuilder(Movie, 'movie');
    let showtimeJoinCondition = '1=1';
    let showtimeJoinParams = {};
    if (filter.date) {
      let startDate = moment(filter.date).startOf('day').toDate();
      if(startDate.getTime() < Date.now()) {
        startDate = moment().toDate();
      } 

      const endDate = moment(filter.date).endOf('day').toDate();
      showtimeJoinCondition = 'showtime.startTime BETWEEN :startDate AND :endDate';
      showtimeJoinParams = { startDate, endDate };
    }
    query.innerJoinAndSelect(
      'movie.showtimes',
      'showtime',
      showtimeJoinCondition,
      showtimeJoinParams,
    );
    let movies = await query.getMany();
    return movies;
  }

  findOne(id: number) {
    return this.movieRepository.findOneBy({ id });
  }

  async update(id: number, updateMovieDto: UpdateMovieDto) {
    const res = await this.movieRepository.update(id, updateMovieDto);
    if (!res.affected) {
      throw new NotFoundException('Movie not found');
    }

    return true;
  }

  async remove(id: number) {
    const resp = await this.movieRepository.softDelete(id);
    if (!resp.affected) {
      throw new NotFoundException('Movie not found');
    }

    return true;
  }
}
