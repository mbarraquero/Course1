import { ApiUserOrderBy } from 'src/api-models';

export interface GetUsersParams {
  gender?: string;
  minAge?: number;
  maxAge?: number;
  pageNumber: number;
  pageSize: number;
  orderBy?: ApiUserOrderBy;
}
