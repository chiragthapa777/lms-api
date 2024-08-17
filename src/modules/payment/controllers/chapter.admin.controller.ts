import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserProtected } from 'src/common/auth/decorators/auth.decorators';
import { ApiDocs } from 'src/common/doc/common-docs';
import { PaginateQueryDto } from 'src/common/doc/query/paginateQuery.dto';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import { ResponseMessage } from 'src/common/response/decorators/responseMessage.decorator';
import {
  IResponse,
  IResponsePaging,
} from 'src/common/response/interfaces/response.interface';
import { USER_ROLE } from 'src/modules/user/entities/user.entity';
import { DataSource, FindOptionsWhere, QueryRunner } from 'typeorm';
import { PaymentService } from '../payment.service';
import { PaymentEntity } from '../entities/payment.entity';
import { PaymentCreateDto, PaymentUpdateDto } from '../payment.dto';

@ApiTags('Payment')
@Controller({
  path: 'payment',
})
export class PaymentAdminController {
  constructor(
    private readonly service: PaymentService,
    private connection: DataSource,
  ) {}

  @ApiDocs({
    operation: 'create payment',
  })
  @UserProtected({ role: USER_ROLE.ADMIN })
  @ResponseMessage('Payment created successfully.')
  @Post('/create')
  async create(
    @Body() dto: PaymentCreateDto,
  ): Promise<IResponse<PaymentEntity>> {
    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.startTransaction();
    try {
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

  @UserProtected({ role: USER_ROLE.ADMIN })
  @ApiDocs({
    operation: 'List payment',
  })
  @ResponseMessage('Payment listed successfully.')
  @Get('/list')
  async list(
    @Query() paginateQueryDto: PaginateQueryDto,
  ): Promise<IResponsePaging<PaymentEntity>> {
    const where: FindOptionsWhere<PaymentEntity> = {};
    const data = await this.service.paginatedGet({
      ...paginateQueryDto,
      searchableColumns: ['content', 'title'],
      defaultSearchColumns: ['title'],
      defaultSortColumn: 'createdAt',
      defaultSortOrder: 'DESC',
      options: {
        where: where,
      },
    });
    return data;
  }

  @UserProtected({ role: USER_ROLE.ADMIN })
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
  async getById(@Param('id') id: number): Promise<IResponse<PaymentEntity>> {
    const data = await this.service.getById(id, {
      options: {},
    });
    if (!data) throw new NotFoundException('Cannot find payment');
    return { data };
  }

  @UserProtected({ role: USER_ROLE.ADMIN })
  @ApiDocs({
    operation: 'Update user',
    params: [
      {
        type: 'number',
        required: true,
        name: 'id',
      },
    ],
  })
  @RequestParamGuard(IdParamDto)
  @ResponseMessage('Payment updated successfully.')
  @Patch('/update/:id')
  async updateById(
    @Param('id') id: number,
    @Body() body: PaymentUpdateDto,
  ): Promise<IResponse<PaymentEntity>> {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const found = await this.service.getById(id);
      if (!found) throw new NotFoundException('Cannot find payment');
      const data = await this.service.update(found, body, {
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

  @UserProtected({ role: USER_ROLE.ADMIN })
  @ApiDocs({
    operation: 'Update user',
    params: [
      {
        type: 'number',
        required: true,
        name: 'id',
      },
    ],
  })
  @RequestParamGuard(IdParamDto)
  @ResponseMessage('Payment deleted successfully.')
  @Patch('/delete/:id')
  async deleteById(
    @Param('id') id: number,
    @Body() body: any,
  ): Promise<IResponse<PaymentEntity>> {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const found = await this.service.getById(id);
      if (!found) throw new NotFoundException('Cannot find payment');
      const data = await this.service.softDelete(found, {
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

  @UserProtected({ role: USER_ROLE.ADMIN })
  @ApiDocs({
    operation: 'Restore payment',
    params: [
      {
        type: 'number',
        required: true,
        name: 'id',
      },
    ],
  })
  @RequestParamGuard(IdParamDto)
  @ResponseMessage('Payment restored successfully.')
  @Patch('/restore/:id')
  async restoreById(
    @Param('id') id: number,
  ): Promise<IResponse<PaymentEntity>> {
    await this.service.restore({ where: { id } });
    const data: PaymentEntity | null = await this.service.getById(id);
    if (!data) throw new NotFoundException('Cannot find payment');
    return { data };
  }
}
