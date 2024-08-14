import { Module } from '@nestjs/common';
import { AuthJwtAccessStrategy } from './guards/jwt-access/auth.jwt-access.strategy';
import { AuthJwtRefreshStrategy } from './guards/jwt-refresh/auth.jwt-refresh.strategy';
import { AuthService } from './services/auth.service';

@Module({
  providers: [AuthService, AuthJwtAccessStrategy, AuthJwtRefreshStrategy],
  exports: [AuthService],
  controllers: [],
  imports: [],
})
export class AuthModule {}
