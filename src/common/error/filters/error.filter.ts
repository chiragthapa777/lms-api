import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { ValidationError } from 'class-validator';
import { Response } from 'express';
import { DebuggerService } from 'src/common/debugger/debugger.service';
import IRequest from 'src/common/request/interfaces/request.interface';
import { QueryFailedError } from 'typeorm';
import {
  IErrorException,
  IErrors,
  IErrorsImport,
  IValidationErrorImport,
} from '../interfaces/error.interface';

@Catch()
export class ErrorFilter {
  constructor(private readonly debuggerService: DebuggerService) {}

  async catch(exception: any, host: ArgumentsHost): Promise<void> {
    const ctx: HttpArgumentsHost = host.switchToHttp();
    const response: Response = ctx.getResponse<Response>();
    const request: IRequest = ctx.getRequest<IRequest>();
    try {
      this.debuggerService.log(
        '🚀 ~ ErrorHttpFilter ~ exception:',
        exception?.message,
      );
      const __path = request.path;
      // const __version =
      //   request.__version ??
      //   this.configService.get<string>('app.versioning.version');
      // set default
      let statusHttp: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      let messagePath =
        typeof exception === 'string' ? exception : `http.${statusHttp}`;
      let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      let _error: string | undefined = undefined;
      let errors:
        | IErrors[]
        | IErrorsImport[]
        | undefined
        | ValidationError[]
        | IValidationErrorImport[] = undefined;
      // let messageProperties: IMessageOptionsProperties = undefined;
      let data: any = undefined;
      let metadata = {
        path: __path,
        // version: __version,
      };
      if (exception instanceof HttpException) {
        const responseException = exception.getResponse();
        statusHttp = exception.getStatus();
        messagePath =
          exception?.getResponse()?.toString() || `http.${statusHttp}`;
        statusCode = exception.getStatus();

        if (this.isErrorException(responseException)) {
          const { _metadata } = responseException;

          statusCode =
            typeof responseException?.statusCode === 'number' ||
            (typeof responseException?.statusCode === 'string' &&
              !isNaN(responseException?.statusCode))
              ? responseException?.statusCode
              : statusCode;
          messagePath =
            typeof responseException?.message === 'string'
              ? responseException?.message
              : messagePath;
          data = responseException.data;
          // messageProperties = _metadata?.customProperty?.messageProperties;
          delete _metadata?.customProperty;

          metadata = {
            ...metadata,
            ..._metadata,
          };

          if (
            responseException.errors?.length &&
            responseException.errors.length > 0
          ) {
            // errors = responseException.errors;
            errors = this.getRequestErrorsMessage(
              responseException.errors as ValidationError[],
            );
          }

          if (!responseException._error) {
            _error =
              typeof responseException._error !== 'string'
                ? JSON.stringify(responseException._error)
                : responseException._error;
          }
        }
      } else if (exception instanceof QueryFailedError) {
        this.debuggerService.warn('QueryFailedError Error');
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
        messagePath = 'Failed to resolve data';
      } else if (exception instanceof Error) {
        messagePath = exception.message;
      }

      const responseBody = {
        statusCode,
        message: messagePath,
        errors,
        _error,
        _metadata: metadata,
        data,
      };

      if (statusHttp == 410) {
        response.setHeader('Cache-Control', 'no-store');
      }

      response
        // .setHeader('x-custom-lang', __customLang)
        .status(statusHttp)
        .json(responseBody);

      // send error to sentry
      if (statusHttp === HttpStatus.INTERNAL_SERVER_ERROR) {
        this.debuggerService.error(exception);
      }
    } catch (e) {
      response.status(500).json({
        statusCode: 500,
        message: 'Internal Server Error',
        errors: undefined,
        _error: undefined,
        _metadata: undefined,
        data: undefined,
      });
    }

    return;
  }

  isErrorException(obj: any): obj is IErrorException {
    return typeof obj === 'object'
      ? 'statusCode' in obj && 'message' in obj
      : false;
  }

  getRequestErrorsMessage(requestErrors: ValidationError[]): IErrors[] {
    const messages: Array<IErrors[]> = [];
    for (const requestError of requestErrors) {
      let children: ValidationError[] | undefined = requestError.children;
      let constraints: string[] = Object.values(requestError.constraints ?? []);
      let property: string = requestError.property;
      // let propertyValue: string = requestError.value;

      while (children?.length && children.length > 0) {
        property = `${property}.${children[0].property}`;

        if (children[0].children && children[0].children.length > 0) {
          children = children[0].children;
        } else {
          if (children[0].constraints) {
            constraints = Object.values(children[0].constraints);
            // propertyValue = children[0].value;
            children = [];
          }
        }
      }

      const errors: IErrors[] = [];
      for (const constraint of constraints) {
        errors.push({
          property,
          message: constraint,
          //  this.get(`request.${constraint}`, {
          //   customLanguages: options?.customLanguages,
          //   properties: {
          //     property,
          //     value: propertyValue,
          //   },
          // }),
        });
      }

      messages.push(errors);
    }

    return messages.flat(1) as IErrors[];
  }
}
