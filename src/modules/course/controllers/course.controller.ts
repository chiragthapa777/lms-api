import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common';
import { ApiDocs } from 'src/common/doc/common-docs';
import { PaginateQueryDto } from 'src/common/doc/query/paginateQuery.dto';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import { ResponseMessage } from 'src/common/response/decorators/responseMessage.decorator';
import {
  IResponse,
  IResponsePaging,
} from 'src/common/response/interfaces/response.interface';
import { DataSource, FindOptionsWhere } from 'typeorm';
import { CourseService } from '../course.service';
import { CourseEntity } from '../entities/course.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Course')
@Controller({
  path: 'course',
})
export class CourseController {
  constructor(private readonly service: CourseService) {}

  @ApiDocs({
    operation: 'List course',
  })
  @ResponseMessage('Users listed successfully.')
  @Get('/list')
  async list(
    @Query() paginateQueryDto: PaginateQueryDto,
  ): Promise<IResponsePaging<CourseEntity>> {
    const where: FindOptionsWhere<CourseEntity> = {};
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
  @ResponseMessage('Chapter retrieved successfully.')
  @Get('/info/:id')
  async getById(@Param('id') id: number): Promise<IResponse<CourseEntity>> {
    const data = await this.service.getById(id, {
      options: {},
    });
    if (!data) throw new NotFoundException('Cannot find course');
    return { data };
  }
}
