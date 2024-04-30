import { HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { propertyOf } from 'src/util-helpers';

import { ApiPageParams, PaginatedResult } from './pagination.models';

@Injectable()
export class PaginationService {

  getPaginationHeader(page: number, itemsPerPage: number) {
    let params = new HttpParams()
      .append(propertyOf<ApiPageParams>("pageNumber"), page)
      .append(propertyOf<ApiPageParams>("pageSize"), itemsPerPage);
    return params;
  }

  getPaginatedResult<T>(response: HttpResponse<T[]>): PaginatedResult<T> {
    const result = response.body ?? [];
    const paginationJson = response.headers.get('Pagination');
    const pagination = JSON.parse(paginationJson ?? '');
    return { result, pagination };
  }
}
