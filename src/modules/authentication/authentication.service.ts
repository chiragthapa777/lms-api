import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import {
  IHelperJwtOptions,
  IHelperJwtVerifyOptions,
} from 'src/common/auth/interfaces/auth.interface';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { LOGIN_WITH_TYPE } from './constants/auth.constants';
import { AuthToken } from './serializations/auth.serialization';

@Injectable()
export class AuthenticationService {
  maxRequest: number;
  maxPasswordRequest: number;
  private readonly accessTokenSecretKey: string;
  private readonly accessTokenExpirationTime: number;
  private readonly accessTokenNotBeforeExpirationTime: number;

  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    this.accessTokenSecretKey = this.configService.get<string>(
      'auth.accessToken.secretKey',
      '',
    );
    this.accessTokenExpirationTime = this.configService.get<number>(
      'auth.accessToken.expirationTime',
      0,
    );
    this.accessTokenNotBeforeExpirationTime = this.configService.get<number>(
      'auth.accessToken.notBeforeExpirationTime',
      0,
    );

    this.maxRequest = Number(this.configService.get('helper.maxRequest'));
    this.maxPasswordRequest = Number(
      this.configService.get('helper.maxPasswordRequest'),
    );
  }

  async comparePasswords(
    enteredPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(enteredPassword, hashedPassword);
  }

  async getNewAccessToken(user: UserEntity): Promise<AuthToken> {
    const accessToken = this.jwtService.sign(
      { id: user.id },
      {
        secret: this.accessTokenSecretKey,
        expiresIn: this.accessTokenExpirationTime,
        notBefore: this.accessTokenNotBeforeExpirationTime,
      },
    );
    return {
      accessToken,
    };
  }

  async getToken(user: UserEntity): Promise<AuthToken> {
    if (user?.deletedAt) {
      throw new BadRequestException('User is not active');
    }

    const accessToken = this.jwtService.sign(
      { id: user.id },
      {
        secret: this.accessTokenSecretKey,
        expiresIn: this.accessTokenExpirationTime,
        notBefore: this.accessTokenNotBeforeExpirationTime,
      },
    );
    return { accessToken };
  }

  jwtEncrypt(payload: Record<string, any>, options: IHelperJwtOptions): string {
    return this.jwtService.sign(payload, {
      secret: options.secretKey,
      expiresIn: options.expiredIn,
      notBefore: options.notBefore ?? 0,
      audience: options.audience,
      issuer: options.issuer,
      subject: options.subject,
    });
  }

  jwtDecrypt(token: string): Record<string, any> {
    return this.jwtService.decode(token) as Record<string, any>;
  }

  jwtVerify(token: string, options: IHelperJwtVerifyOptions): boolean {
    try {
      this.jwtService.verify(token, {
        secret: options.secretKey,
        audience: options.audience,
        issuer: options.issuer,
        subject: options.subject,
      });

      return true;
    } catch (err: unknown) {
      return false;
    }
  }

  async getUserForRequest(id: number): Promise<UserEntity | null> {
    return await this.userService.getById(id);
  }
}
