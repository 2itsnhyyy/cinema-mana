import axiosInstance from '@/config/axiosInstance';
import { Employee, EmployeeGender, EmployeeRole } from '@/types';
import Response from './types';

export type CreateEmployeeDto = {
  name: string;
  username: string;
  phoneNumber: string;
  birthDate: Date;
  gender: EmployeeGender;
  address: string;
  password: string;
  identityCard: string;
  role: EmployeeRole;
};

class EmployeeService {
  async getMany(): Promise<Response<Employee[]>> {
    try {
      const response = await axiosInstance.get('/employees');
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error.message);
    }
  }
  async createOne(employee: CreateEmployeeDto): Promise<Response<any>> {
    try {
      const response = await axiosInstance.post('/employees', employee);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error.message);
    }
  }

  async updateOne(
    id: number,
    employee: Partial<CreateEmployeeDto>
  ): Promise<Response<any>> {
    try {
      const response = await axiosInstance.patch(`/employees/${id}`, employee);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error.message);
    }
  }

  async deleteOne(id: number): Promise<Response<any>> {
    try {
      const response = await axiosInstance.delete(`/employees/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error.message);
    }
  }
}

export default new EmployeeService();
