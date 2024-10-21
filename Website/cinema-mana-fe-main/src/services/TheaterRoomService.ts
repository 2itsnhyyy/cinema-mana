import axiosInstance from '@/config/axiosInstance';
import { TheaterRoom } from '@/types';
import Response from './types';
import { UpdateSeatsDto } from './ShowtimeService';

export type CreateTheaterRoomDto = {
  id: number;
  roomNumber: number;
  capacity: number;
  isActive: boolean;
};

class TheaterRoomService {
  async getMany(): Promise<Response<TheaterRoom[]>> {
    try {
      const response = await axiosInstance.get('/theater-rooms');
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error.message);
    }
  }
  async getTheaterRoomById(id: number): Promise<Response<TheaterRoom>> {
    try {
      const response = await axiosInstance.get('/theater-rooms/' + id);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error.message);
    }
  }
  async createOne(room: CreateTheaterRoomDto): Promise<Response<any>> {
    try {
      const response = await axiosInstance.post('/theater-rooms', room);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error.message);
    }
  }

  async updateOne(
    id: number,
    room: Partial<CreateTheaterRoomDto>
  ): Promise<Response<any>> {
    try {
      const response = await axiosInstance.patch(`/theater-rooms/${id}`, room);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error.message);
    }
  }

  async deleteOne(id: number): Promise<Response<any>> {
    try {
      const response = await axiosInstance.delete(`/theater-rooms/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error.message);
    }
  }

  async updateSeats(
    roomId: number,
    data: UpdateSeatsDto
  ): Promise<Response<any>> {
    console.log('data', data);
    try {
      const response = await axiosInstance.patch(
        `/theater-rooms/${roomId}/seats`,
        {
          seatIds: data.seatIds,
          seatType: data.seatType,
        }
      );
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error.message);
    }
  }
}

export default new TheaterRoomService();
