import axiosInstance from '@/config/axiosInstance';
import { Movie } from '@/types';
import Response from './types';

export type CreateMovieDto = {
  id: string;
  poster: string;
  title: string;
  author: string;
  description: string;
  type: string;
  duration: string;
  releaseDate: string;
};

class MovieService {
  async getMany(): Promise<Response<Movie[]>> {
    try {
      const response = await axiosInstance.get('/movies');
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error.message);
    }
  }
  async getByDate(date: string): Promise<Response<Movie[]>> {
    try {
      const response = await axiosInstance.get('/movies', {
        params: {
          queryType: 'SHOWING',
          date,
        },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error.message);
    }
  }
  async createOne(movie: CreateMovieDto): Promise<Response<any>> {
    try {
      const response = await axiosInstance.post('/movies', movie);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error.message);
    }
  }

  async updateOne(
    id: number,
    movie: Partial<CreateMovieDto>
  ): Promise<Response<any>> {
    try {
      const response = await axiosInstance.patch(`/movies/${id}`, movie);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error.message);
    }
  }

  async deleteOne(id: number): Promise<Response<any>> {
    try {
      const response = await axiosInstance.delete(`/movies/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error.message);
    }
  }
}

export default new MovieService();
