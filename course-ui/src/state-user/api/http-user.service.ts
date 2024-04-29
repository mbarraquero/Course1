import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { environment } from 'src/environments/environment';
import { PaginationService } from 'src/pagination';
import { propertyOf } from 'src/util-helpers';

import { ApiMemberDto, ApiMemberUpdateDto, ApiUserParams, GetUsersParams } from './http-user.models';

@Injectable()
export class HttpUserService {
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private readonly paginationService: PaginationService,
    private readonly http: HttpClient,
  ) {}

  getUsers(userParams: GetUsersParams) {
    const requestUrl = this.apiUrl + 'Users';
    let params = this.paginationService.getPaginationHeader(userParams.pageNumber, userParams.pageSize);
    if (userParams.gender) params = params?.append(
      propertyOf<ApiUserParams>("gender"), userParams.gender
    );
    if (userParams.minAge) params = params?.append(
      propertyOf<ApiUserParams>("minAge"), userParams.minAge
    );
    if (userParams.maxAge) params = params?.append(
      propertyOf<ApiUserParams>("maxAge"), userParams.maxAge
    );
    if (userParams.orderBy) params = params?.append(
      propertyOf<ApiUserParams>("orderBy"), userParams.orderBy
    );
    return this.http.get<ApiMemberDto[]>(
        requestUrl,
        { params, observe: 'response' }
      )
      .pipe(map((response) =>
        this.paginationService.getPaginatedResult(response)
      ));
  }

  getUserByName(username: string) {
    const requestUrl = this.apiUrl + 'Users/' + username;
    return this.http.get<ApiMemberDto>(requestUrl)
      .pipe(map((response) => response));
  }

  updateUser(userUpdate: ApiMemberUpdateDto) {
    const requestUrl = this.apiUrl + 'Users';
    return this.http.put<ApiMemberDto>(requestUrl, userUpdate)
      .pipe(map((response) => response));
  }

  setMainPhoto(photoId: number) {
    const requestUrl = this.apiUrl + 'Users/set-main-photo/' + photoId;
    return this.http.put<void>(requestUrl, {});
  }

  deletePhoto(photoId: number) {
    const requestUrl = this.apiUrl + 'Users/delete-photo/' + photoId;
    return this.http.delete<void>(requestUrl);
  }
}