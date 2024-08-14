import {
  BadRequestException,
  Body,
  Controller,
  Post,
  SerializeOptions,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ALL_GROUP } from 'src/common/database/constant/serialization-group.constant';
import { ResponseMessage } from 'src/common/response/decorators/responseMessage.decorator';
import { IResponse } from 'src/common/response/interfaces/response.interface';
import { DataSource } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserEntity } from '../entities/user.entity';
import { UserService } from '../user.service';

@SerializeOptions({
  groups: ALL_GROUP,
})
@ApiTags('User')
@Controller('user')
export class UserStudentController {
  constructor(
    private readonly userService: UserService,
    private connection: DataSource,
  ) {}

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
}
