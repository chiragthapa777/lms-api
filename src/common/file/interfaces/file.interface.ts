import { IHelperFileRows } from 'src/common/helper/interfaces/helper.interface';
import { Multer } from 'multer';

export type IFile = Omit<Multer.File, 'filename'>;

export type IFileExtract<T> = IFile & {
  extract: IHelperFileRows[];
  dto?: T[];
};

export type IFileExtractAllSheets<T> = IFile & {
  extracts: IHelperFileRows[][];
  dto?: T[][];
};
