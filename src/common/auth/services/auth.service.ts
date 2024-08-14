import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  getAccessToken(): string {
    return 'test';
  }
  getRefreshTokenToken(): string {
    return 'test';
  }
}
