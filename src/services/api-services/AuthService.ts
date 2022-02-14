import { baseApiService } from './BaseApiService';
import { User } from '../../models/entities/User';

class AuthService {
  static getInstance(): AuthService {
    return new AuthService();
  }

  async login(data: {
    email: string;
    password: string;
  }): Promise<{ user: User; token: string }> {
    return baseApiService.post('/login', data, { extras: { useAuth: false } });
  }

  async fetchMe(): Promise<{ user: User }> {
    return baseApiService.get('/me');
  }
}

export const authService = AuthService.getInstance();
