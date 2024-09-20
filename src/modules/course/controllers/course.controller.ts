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
import { ApiDocs } from 'src/common/doc/common-docs';
import { PaginateQueryDto } from 'src/common/doc/query/paginateQuery.dto';
import { IdParamDto } from 'src/common/dto/id-param.dto';
import { RequestParamGuard } from 'src/common/request/decorators/request.decorator';
import { ResponseMessage } from 'src/common/response/decorators/responseMessage.decorator';
import {
  IResponse,
  IResponsePaging,
} from 'src/common/response/interfaces/response.interface';
import { DataSource, FindOptionsWhere, In, QueryRunner } from 'typeorm';
import { CourseService } from '../course.service';
import { CourseEntity } from '../entities/course.entity';
import { ApiTags } from '@nestjs/swagger';
import {
  GetUser,
  UserExtract,
  UserProtected,
} from 'src/common/auth/decorators/auth.decorators';
import { USER_ROLE, UserEntity } from 'src/modules/user/entities/user.entity';
import { CourseEnrollDto, CourseRateDto, CourseUpdateDto } from '../course.dto';
import { EnrollmentService } from 'src/modules/enrollment/enrollment.service';
import { PaymentService } from 'src/modules/payment/payment.service';
import { CourseEnrollmentEntity } from 'src/modules/enrollment/entities/course-enrollements.entity';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@ApiTags('Course')
@Controller({
  path: 'course',
})
export class CourseController {
  constructor(
    private readonly service: CourseService,
    private readonly enrollService: EnrollmentService,
    private readonly paymentService: PaymentService,
    private connection: DataSource,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  @ApiDocs({
    operation: 'List course',
  })
  @ResponseMessage('Users listed successfully.')
  @Get('/list')
  @UserExtract()
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
        relations: {
          enrollments: true,
        },
      },
    });
    return data;
  }

  @ApiDocs({
    operation: 'recommend course',
  })
  @ResponseMessage('Users listed successfully.')
  @Get('/recommend')
  @UserExtract()
  async recommend(
    @Query() paginateQueryDto: PaginateQueryDto,
    @GetUser() user: UserEntity | null,
  ): Promise<IResponsePaging<CourseEntity>> {
    if (!user) {
      return await this.list(paginateQueryDto);
    }

    try {
      const data = await this.httpService.axiosRef.get(
        this.configService.get('RECOMENDER_URL') +
          '/recommend/' +
          user.id.toString(),
      );
      const recommendedCourses: number[] = data.data?.recommendedCourses ?? [];
      if (!recommendedCourses) {
        return await this.list(paginateQueryDto);
      }
      const courses = await this.service.getAll({
        options: {
          where: {
            id: In(recommendedCourses),
          },
        },
      });

      return {
        data: courses,
        _pagination: {
          totalPage: 1,
          total: recommendedCourses.length,
          limit: 10,
          page: 1,
        },
      };
    } catch (error) {
      return await this.list(paginateQueryDto);
    }
  }

  @ApiDocs({
    operation: 'List course',
  })
  @ResponseMessage('Users listed successfully.')
  @Get('/enrolled')
  @UserProtected({ role: USER_ROLE.USER })
  async enrolled(
    @Query() paginateQueryDto: PaginateQueryDto,
    @GetUser() user: UserEntity,
  ): Promise<IResponsePaging<CourseEntity>> {
    const queryBuilder = this.service
      .getQueryBuilder('course')
      .leftJoinAndSelect('course.chapters', 'chapters')
      .leftJoinAndSelect('chapters.notes', 'notes')
      .innerJoinAndSelect(
        'course.enrollments',
        'enrollments',
        'enrollments.userId=:userId',
        { userId: user.id },
      );
    const data = await this.service.paginatedQueryBuilderFind({
      ...paginateQueryDto,
      searchableColumns: ['content', 'title'],
      defaultSearchColumns: ['title'],
      defaultSortColumn: 'createdAt',
      defaultSortOrder: 'DESC',
      queryBuilder,
    });
    return data;
  }

  @UserProtected({ role: USER_ROLE.USER })
  @ApiDocs({
    operation: 'rate course',
    params: [
      {
        type: 'number',
        required: true,
        name: 'id',
      },
    ],
  })
  @RequestParamGuard(IdParamDto)
  @ResponseMessage('Course updated successfully.')
  @Patch('/rate/:id')
  async rateById(
    @Param('id') id: number,
    @Body() body: CourseRateDto,
    @GetUser() user: UserEntity,
  ): Promise<IResponse<any>> {
    const queryRunner: QueryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const found = await this.service.getById(id);

      if (!found) {
        throw new NotFoundException('Cannot find course');
      }

      const enrollment: CourseEnrollmentEntity | null =
        await this.enrollService.getOne({
          entityManager: queryRunner.manager,
          options: {
            where: {
              userId: user.id,
              courseId: id,
            },
          },
        });

      if (!enrollment) {
        throw new NotFoundException('Cannot find enrollment');
      }

      await this.enrollService.update(enrollment, body, {
        entityManager: queryRunner.manager,
      });

      const ratings = await this.enrollService
        .getQueryBuilder('enroll')
        .where('enroll.courseId = :courseId and enroll.rating is not NULL', {
          courseId: enrollment.courseId,
        })
        .select('AVG(rating)', 'avg')
        .getRawOne();

      if (!found) {
        throw new NotFoundException('Cannot find course');
      }

      await this.service.update(
        found,
        { rating: Number(ratings?.avg ?? 0) },
        { entityManager: queryRunner.manager },
      );

      await queryRunner.commitTransaction();
      return { data: ratings };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  @UserProtected({ role: USER_ROLE.USER })
  @ApiDocs({
    operation: 'enroll course',
    params: [
      {
        type: 'number',
        required: true,
        name: 'id',
      },
    ],
  })
  @RequestParamGuard(IdParamDto)
  @ResponseMessage('Course updated successfully.')
  @Patch('/enroll/:id')
  async enrollById(
    @Param('id') id: number,
    @Body() body: CourseEnrollDto,
    @GetUser() user: UserEntity,
  ): Promise<IResponse<any>> {
    console.log('🚀 ~ CourseController ~ Body:', Body);
    const queryRunner: QueryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const found = await this.service.getById(id);

      if (!found) {
        throw new NotFoundException('Cannot find course');
      }

      const payment = await this.paymentService.create(
        {
          amount: found.price,
          transactionId: body.transactionId,
          userId: user.id,
          remark: 'Paid from esewa',
        },
        { entityManager: queryRunner.manager },
      );

      const enrollment = await this.enrollService.create(
        {
          courseId: found.id,
          userId: user.id,
          rating: null,
          review: '',
          paymentId: payment.id,
        },
        {
          entityManager: queryRunner.manager,
        },
      );

      await queryRunner.commitTransaction();
      return { data: enrollment };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
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
  @UserProtected()
  @RequestParamGuard(IdParamDto)
  @ResponseMessage('Chapter retrieved successfully.')
  @Get('/info/:id')
  async getById(
    @Param('id') id: number,
    @GetUser() user: UserEntity,
  ): Promise<IResponse<CourseEntity>> {
    const queryBuilder = this.service
      .getQueryBuilder('course')
      .where('course.id = :id', { id })
      .leftJoinAndSelect('course.enrollments', 'enrollments')
      .leftJoinAndSelect('enrollments.user', 'user')
      .leftJoinAndSelect('course.chapters', 'chapters')
      .leftJoinAndSelect(
        'chapters.notes',
        'notes',
        ' notes.userId = :userId ',
        { userId: user.id },
      );
    const data = await queryBuilder.getOne();
    if (!data) throw new NotFoundException('Cannot find course');
    return { data };
  }
}
