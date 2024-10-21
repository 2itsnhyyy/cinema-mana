import axiosInstance from '@/config/axiosInstance';
import Response from './types';
import { Customer } from '@/types';

class CustomerService {
  async getByPhone(phone: string): Promise<Customer | null> {
    try {
      const response = await axiosInstance.get('/customers', {
        params: {
          phone,
        },
      });
      return response.data.data[0];
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error.message);
    }
  }

  async create(data: Partial<Customer>): Promise<Customer> {
    try {
      const response = await axiosInstance.post('/customers', data);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error.message);
    }
  }
}

export default new CustomerService();
