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
import { DataSource, FindOptionsWhere, QueryRunner } from 'typeorm';
import { NoteCreateDto, NoteUpdateDto } from '../note.dto';
import { NoteService } from '../note.service';
import { NotesEntity } from '../entities/note.entity';

@ApiTags('Note')
@Controller({
  path: 'note',
})
export class NoteController {
  constructor(
    private readonly service: NoteService,
    private connection: DataSource,
  ) {}

  @ApiDocs({
    operation: 'create Note',
  })
  @UserProtected({ role: USER_ROLE.USER })
  @ResponseMessage('Note created successfully.')
  @Post('/create')
  async create(
    @Body() dto: NoteCreateDto,
    @GetUser() user: UserEntity,
  ): Promise<IResponse<NotesEntity>> {
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
    operation: 'List Note',
  })
  @ResponseMessage('Note listed successfully.')
  @Get('/list')
  async list(
    @Query() paginateQueryDto: PaginateQueryDto,
  ): Promise<IResponsePaging<NotesEntity>> {
    const where: FindOptionsWhere<NotesEntity> = {};
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
  @ResponseMessage('Note retrieved successfully.')
  @Get('/info/:id')
  async getById(@Param('id') id: number): Promise<IResponse<NotesEntity>> {
    const data = await this.service.getById(id, {
      options: {},
    });
    if (!data) throw new NotFoundException('Cannot find Note');
    return { data };
  }

  @UserProtected({ role: USER_ROLE.USER })
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
  @ResponseMessage('Note updated successfully.')
  @Patch('/update/:id')
  async updateById(
    @Param('id') id: number,
    @Body() body: NoteUpdateDto,
  ): Promise<IResponse<NotesEntity>> {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const found = await this.service.getById(id);
      if (!found) throw new NotFoundException('Cannot find Note');
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

  @UserProtected({ role: USER_ROLE.USER })
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
  @ResponseMessage('Note deleted successfully.')
  @Patch('/delete/:id')
  async deleteById(
    @Param('id') id: number,
    @Body() body: any,
  ): Promise<IResponse<NotesEntity>> {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const found = await this.service.getById(id);
      if (!found) throw new NotFoundException('Cannot find Note');
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

  @UserProtected({ role: USER_ROLE.USER })
  @ApiDocs({
    operation: 'Restore Note',
    params: [
      {
        type: 'number',
        required: true,
        name: 'id',
      },
    ],
  })
  @RequestParamGuard(IdParamDto)
  @ResponseMessage('Note restored successfully.')
  @Patch('/restore/:id')
  async restoreById(@Param('id') id: number): Promise<IResponse<NotesEntity>> {
    await this.service.restore({ where: { id } });
    const data: NotesEntity | null = await this.service.getById(id);
    if (!data) throw new NotFoundException('Cannot find Note');
    return { data };
  }
}
