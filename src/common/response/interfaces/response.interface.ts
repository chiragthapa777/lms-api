export interface IResponse<T = Record<string, any>> {
  _metadata?: Record<string, any>;
  data?: T;
}

export interface IResponsePaging<T = Record<string, any>> {
  _metadata?: Record<string, any>;
  _pagination: IPaginationMeta;
  data: T[];
}

export interface IPaginationMeta {
  totalPage: number;
  total: number;
  limit: number;
  page: number;
  nextPage?: number | null;
  prevPage?: number | null;
  sortOrder?: 'ASC' | 'DESC';
  sortBy?: string;
  search?: string;
  searchBy?: string;
  skipPagination?: boolean;
}
