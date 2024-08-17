import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  GetUser,
  UserProtected,
} from 'src/common/auth/decorators/auth.decorators';
import { ApiDocs } from 'src/common/doc/common-docs';
import { PaginateQueryDto } from 'src/common/doc/query/paginateQuery.dto';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import { ResponseMessage } from 'src/common/response/decorators/responseMessage.decorator';
import {
  IResponse,
  IResponsePaging,
} from 'src/common/response/interfaces/response.interface';
import { USER_ROLE, UserEntity } from 'src/modules/user/entities/user.entity';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { PaymentEntity } from '../entities/payment.entity';
import { PaymentCreateDto } from '../payment.dto';
import { PaymentService } from '../payment.service';

@ApiTags('Payment')
@Controller({
  path: 'payment',
})
export class PaymentController {
  constructor(
    private readonly service: PaymentService,
    private connection: DataSource,
  ) {}

  @ApiDocs({
    operation: 'create payment',
  })
  @UserProtected({ role: USER_ROLE.USER })
  @ResponseMessage('Payment created successfully.')
  @Post('/create')
  async create(
    @Body() dto: PaymentCreateDto,
    @GetUser() user: UserEntity,
  ): Promise<IResponse<PaymentEntity>> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      dto.userId = user.id;
      const data = await this.service.create(dto, {
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

  @UserProtected({ role: USER_ROLE.USER })
  @ApiDocs({
    operation: 'List payment',
  })
  @ResponseMessage('Payment listed successfully.')
  @Get('/list')
  async list(
    @Query() paginateQueryDto: PaginateQueryDto,
    @GetUser() user: UserEntity,
  ): Promise<IResponsePaging<PaymentEntity>> {
    const where: FindOptionsWhere<PaymentEntity> = {
      userId: user.id,
    };
    const data = await this.service.paginatedGet({
      ...paginateQueryDto,
      searchableColumns: ['remarks', 'transactionId'],
      defaultSearchColumns: ['remarks', 'transactionId'],
      defaultSortColumn: 'createdAt',
      defaultSortOrder: 'DESC',
      options: {
        where: where,
      },
    });
    return data;
  }

  @UserProtected({ role: USER_ROLE.USER })
  @ApiDocs({
    operation: 'Get by Id',
    params: [
      {
        type: 'number',
        required: true,
        name: 'id',
      },
    ],
  })
  @RequestParamGuard(IdParamDto)
  @ResponseMessage('Payment retrieved successfully.')
  @Get('/info/:id')
  async getById(
    @Param('id') id: number,
    @GetUser() user: UserEntity,
  ): Promise<IResponse<PaymentEntity>> {
    const data = await this.service.getById(id, {
      options: {},
    });
    if (!data) throw new NotFoundException('Cannot find payment');
    return { data };
  }
}
