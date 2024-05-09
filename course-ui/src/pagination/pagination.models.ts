export interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
};

export interface PaginatedResult<T> {
  pagination: Pagination;
  result: T[];
};