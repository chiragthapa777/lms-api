import {
  PipeTransform,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { IFile } from '../interfaces/file.interface';
import { ENUM_FILE_STATUS_CODE_ERROR } from '../constants/file.status-code.constant';

@Injectable()
export class FileRequiredPipe implements PipeTransform {
  async transform(value: IFile | IFile[]): Promise<IFile | IFile[]> {
    await this.validate(value);

    return value;
  }

  async validate(value: IFile | IFile[]): Promise<void> {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      throw new UnprocessableEntityException({
        statusCode: ENUM_FILE_STATUS_CODE_ERROR.FILE_NEEDED_ERROR,
        message: 'File not found',
      });
    }

    return;
  }
}
