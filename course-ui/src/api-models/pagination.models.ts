export interface ApiPaginationHeader {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
};

export interface ApiPageParams {
  pageNumber: number;
  pageSize: number;
};