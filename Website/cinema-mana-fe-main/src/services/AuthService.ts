import axiosInstance from '@/config/axiosInstance';
import Response from './types';
interface LoginResponse {
  accessToken: string;
  employee: {
    id: number;
    name: string;
    role: string;
  };
}

class AuthService {
  async login(
    username: string,
    password: string
  ): Promise<Response<LoginResponse>> {
    try {
      const response = await axiosInstance.post('/auth/signin', {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      throw new Error('Login failed');
    }
  }

  async logout(): Promise<void> {
    try {
      console.log('Logout successful');
    } catch (error) {
      throw new Error('Logout failed');
    }
  }
}

export default new AuthService();
