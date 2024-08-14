import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  SerializeOptions,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  GetUser,
  UserProtected,
} from 'src/common/auth/decorators/auth.decorators';
import { ALL_GROUP } from 'src/common/database/constant/serialization-group.constant';
import { ApiDocs } from 'src/common/doc/common-docs';
import { UserTypeDto } from 'src/common/doc/query/UserType.dto';
import { PaginateQueryDto } from 'src/common/doc/query/paginateQuery.dto';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import { ResponseMessage } from 'src/common/response/decorators/responseMessage.decorator';
import {
  IResponse,
  IResponsePaging,
} from 'src/common/response/interfaces/response.interface';
import { DataSource, FindOptionsWhere, QueryRunner } from 'typeorm';
import { UpdateUserDto, UpdateUserProfileDto } from '../dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';
import {
  UserPaginationSerialization,
  UserSerialization,
} from '../serializations/user.serialization';
import { UserService } from '../user.service';
import { CreateUserDto } from '../dto/create-user.dto';

@SerializeOptions({
  groups: ALL_GROUP,
})
@ApiTags('User')
@Controller('user')
export class UserAdminController {
  constructor(
    private readonly userService: UserService,
    private connection: DataSource,
  ) {}

  @UserProtected()
  @ResponseMessage('User created successfully.')
  @Post('/create')
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<IResponse<UserEntity>> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const user = await this.userService.getOne({
        options: {
          where: {
            email: createUserDto.email,
          },
        },
      });
      if (user) {
        throw new BadRequestException('Email exists');
      }
      const data: UserEntity = await this.userService.create(createUserDto, {
        entityManager: queryRunner.manager,
      });
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
    operation: 'List user',
    serialization: UserPaginationSerialization,
  })
  @ResponseMessage('Users listed successfully.')
  @Get('/list')
  async list(
    @Query() paginateQueryDto: PaginateQueryDto,
    @Query() type?: UserTypeDto,
  ): Promise<IResponsePaging<UserEntity>> {
    const where: FindOptionsWhere<UserEntity> = {};
    const data = await this.userService.paginatedGet({
      ...paginateQueryDto,
      searchableColumns: ['email', 'name'],
      defaultSearchColumns: ['email', 'name'],
      defaultSortColumn: 'id',
      options: {
        where: where,
      },
    });
    return data;
  }

  @UserProtected()
  @ApiDocs({
    operation: 'Get user',
    serialization: UserSerialization,
    params: [
      {
        type: 'number',
        required: true,
        name: 'id',
      },
    ],
  })
  @RequestParamGuard(IdParamDto)
  @ResponseMessage('User retrieved successfully.')
  @Get('/info/:id')
  async getById(@Param('id') id: number): Promise<IResponse<UserEntity>> {
    const data = await this.userService.getById(id, {
      options: {},
    });
    if (!data) throw new NotFoundException('Cannot find user');
    return { data };
  }

  @UserProtected()
  @ApiDocs({
    operation: 'Update user',
    serialization: UserSerialization,
    params: [
      {
        type: 'number',
        required: true,
        name: 'id',
      },
    ],
  })
  @RequestParamGuard(IdParamDto)
  @ResponseMessage('User updated successfully.')
  @Patch('/update/:id')
  async updateById(
    @Param('id') id: number,
    @Body() body: UpdateUserDto,
  ): Promise<IResponse<UserEntity>> {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const found: UserEntity | null = await this.userService.getById(id);
      if (!found) throw new NotFoundException('Cannot find user');
      const data = await this.userService.update(found, body, {
        entityManager: queryRunner.manager,
      });
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
    operation: 'Update own profile',
    serialization: UserSerialization,
  })
  @ResponseMessage('User profile updated successfully.')
  @Patch('/update-profile')
  async updateProfile(
    @Body() updateData: UpdateUserProfileDto,
    @GetUser() user: UserEntity,
  ): Promise<IResponse<UserEntity>> {
    const data = await this.userService.update(user, updateData);
    return { data };
  }

  @UserProtected()
  @ApiDocs({
    operation: 'Restore user',
    serialization: UserSerialization,
    params: [
      {
        type: 'number',
        required: true,
        name: 'id',
      },
    ],
  })
  @RequestParamGuard(IdParamDto)
  @ResponseMessage('User restored successfully.')
  @Patch('/restore/:id')
  async restoreById(@Param('id') id: number): Promise<IResponse<UserEntity>> {
    await this.userService.restore({ where: { id } });
    const data: UserEntity | null = await this.userService.getById(id);
    if (!data) throw new NotFoundException('Cannot find user');
    return { data };
  }
}
