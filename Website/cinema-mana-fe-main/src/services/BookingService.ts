import axiosInstance from '@/config/axiosInstance';

class BookingService {
  async getMany(): Promise<any> {
    try {
      const response = await axiosInstance.get('/bookings');
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error.message);
    }
  }

  async create(data: any): Promise<any> {
    try {
      const response = await axiosInstance.post('/bookings', data);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error.message);
    }
  }
}

export default new BookingService();
