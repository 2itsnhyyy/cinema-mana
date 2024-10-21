import { IsOptional } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, Column, DeleteDateColumn, OneToMany } from 'typeorm';
import { Showtime } from '../../showtime/entities/showtime.entity';

@Entity({ name: 'movies' })
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  author: string;

  @Column()
  description: string;

  @Column()
  type: string;

  @Column()
  duration: number;

  @Column()
  releaseDate: Date;

  @Column()
  poster: string;

  @Column()
  isPublished: boolean;
  
  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(() => Showtime, (showtime) => showtime.movie)
  showtimes: Showtime[];
}
