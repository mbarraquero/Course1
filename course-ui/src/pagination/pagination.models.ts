export interface ApiPaginationHeader {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
};

export interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
};

export interface ApiPageParams {
  pageNumber: number;
  pageSize: number;
};

export interface PaginatedResult<T> {
  pagination: Pagination;
  result: T[];
};