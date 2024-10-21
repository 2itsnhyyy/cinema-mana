import axiosInstance from '@/config/axiosInstance';
import { Seat, SeatType, Showtime } from '@/types';
import Response from './types';

export type CreateShowtimeDto = {
  id: string;
  movieId: number;
  theaterRoomId: number;
  startTime: string;
  endTime: string;
};
export type UpdateSeatsDto = {
  seatIds: number[];
  seatType: SeatType;
};

class ShowtimeService {
  async getMany(): Promise<Response<Showtime[]>> {
    try {
      const response = await axiosInstance.get('/showtimes');
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error.message);
    }
  }
  async getShowtimeById(id: number): Promise<Response<Showtime>> {
    try {
      const response = await axiosInstance.get('/showtimes/' + id);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error.message);
    }
  }
  async createOne(room: CreateShowtimeDto): Promise<Response<any>> {
    try {
      const response = await axiosInstance.post('/showtimes', room);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error.message);
    }
  }

  async updateOne(
    id: number,
    room: Partial<CreateShowtimeDto>
  ): Promise<Response<any>> {
    try {
      const response = await axiosInstance.patch(`/showtimes/${id}`, room);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error.message);
    }
  }

  async deleteOne(id: number): Promise<Response<any>> {
    try {
      const response = await axiosInstance.delete(`/showtimes/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error.message);
    }
  }

  async updateShowtimeSeats(
    showtimeId: number,
    data: UpdateSeatsDto
  ): Promise<Response<any>> {
    console.log('data', data);
    try {
      const response = await axiosInstance.patch(
        `/showtimes/${showtimeId}/seats`,
        {
          showtimeSeatIds: data.seatIds,
          seatType: data.seatType,
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error.message);
    }
  }
}

export default new ShowtimeService();
