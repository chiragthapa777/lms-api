import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  SerializeOptions,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import {
  GetUser,
  UserProtected,
} from 'src/common/auth/decorators/auth.decorators';
import { ADMIN_ONLY_GROUP } from 'src/common/database/constant/serialization-group.constant';
import { ApiDocs } from 'src/common/doc/common-docs';
import { ResponseMessage } from 'src/common/response/decorators/responseMessage.decorator';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { UserSerialization } from 'src/modules/user/serializations/user.serialization';
import { DataSource, QueryRunner } from 'typeorm';
import { AuthenticationService } from '../authentication.service';
import { LoginDto, RegisterDto } from '../dto/login.dto';
import {
  AuthToken,
  AuthTokenSerialization,
} from '../serializations/auth.serialization';
import { UserService } from 'src/modules/user/user.service';
@SerializeOptions({
  groups: ADMIN_ONLY_GROUP,
})
@ApiTags('Authentication')
@Controller('auth')
export class AuthenticationAdminController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService,
    private connection: DataSource,
  ) {}

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiDocs({
    operation: 'Login',
    serialization: AuthTokenSerialization,
    jwtAccessToken: false,
  })
  @Post('login')
  async login(@Body() body: LoginDto) {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await this.userService.getOne({
        options: {
          where: {
            email: body.email,
          },
          select: {
            password: true,
            email: true,
            id: true,
          },
        },
      });
      if (!user) {
        throw new BadRequestException('Invalid credentials');
      }
      if (
        !(await this.authenticationService.comparePasswords(
          body.password,
          user.password,
        ))
      ) {
        throw new BadRequestException('Invalid credentials');
      }
      const data: AuthToken = await this.authenticationService.getToken(user);
      await queryRunner.commitTransaction();
      return { data };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @ApiDocs({
    operation: 'Register',
    serialization: AuthTokenSerialization,
    jwtAccessToken: false,
  })
  @Post('register')
  async register(@Body() body: RegisterDto) {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await this.userService.getOne({
        options: {
          where: {
            email: body.email,
          },
          select: {
            password: true,
            email: true,
            id: true,
          },
        },
      });
      if (user) {
        throw new BadRequestException('Email exists ');
      }

      const newUser = await this.userService.create(body);

      const data: AuthToken =
        await this.authenticationService.getToken(newUser);
      await queryRunner.commitTransaction();
      return { data };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  @UserProtected()
  @ApiDocs({
    operation: 'Get information of logged in user',
    serialization: UserSerialization,
  })
  @ResponseMessage('Get user')
  @Get('me')
  async me(@GetUser() user: UserEntity): Promise<IResponse<UserEntity>> {
    return { data: user };
  }
}
