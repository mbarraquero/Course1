import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { environment } from 'src/environments/environment';
import { PaginationService } from 'src/pagination';
import { propertyOf } from 'src/util-helpers';

import {
  ApiLikeDto,
  ApiLikesPredicate,
  ApiMemberDto,
  ApiMemberUpdateDto,
  ApiMessageDto,
  ApiMessagesContainer,
  ApiUserParams,
  GetUsersParams,
} from './http-user.models';

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
    if (userParams.gender) params = params.append(
      propertyOf<ApiUserParams>("gender"), userParams.gender
    );
    if (userParams.minAge) params = params.append(
      propertyOf<ApiUserParams>("minAge"), userParams.minAge
    );
    if (userParams.maxAge) params = params.append(
      propertyOf<ApiUserParams>("maxAge"), userParams.maxAge
    );
    if (userParams.orderBy) params = params.append(
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
    return this.http.get<ApiMemberDto>(requestUrl);
  }

  updateUser(userUpdate: ApiMemberUpdateDto) {
    const requestUrl = this.apiUrl + 'Users';
    return this.http.put<ApiMemberDto>(requestUrl, userUpdate);
  }

  setMainPhoto(photoId: number) {
    const requestUrl = this.apiUrl + 'Users/set-main-photo/' + photoId;
    return this.http.put<void>(requestUrl, {});
  }

  deletePhoto(photoId: number) {
    const requestUrl = this.apiUrl + 'Users/delete-photo/' + photoId;
    return this.http.delete<void>(requestUrl);
  }

  like(username: string) {
    const requestUrl = this.apiUrl + 'Likes/' + username;
    return this.http.post<void>(requestUrl, {});
  }

  getLikesByPredicate(pageNumber: number, pageSize: number, predicate: ApiLikesPredicate) {
    const params = this.paginationService.getPaginationHeader(pageNumber, pageSize)
      .append('predicate', predicate);
    const requestUrl = this.apiUrl + 'Likes';
    return this.http.get<ApiLikeDto[]>(
      requestUrl,
      { params, observe: 'response' }
    )
    .pipe(map((response) =>
      this.paginationService.getPaginatedResult(response)
    ));
  }

  getMessagesByContainer(pageNumber: number, pageSize: number, container: ApiMessagesContainer) {
    const params = this.paginationService.getPaginationHeader(pageNumber, pageSize)
      .append('container', container);
    const requestUrl = this.apiUrl + 'Messages';
    return this.http.get<ApiMessageDto[]>(
      requestUrl,
      { params, observe: 'response' }
    )
    .pipe(map((response) =>
      this.paginationService.getPaginatedResult(response)
    ));
  }

  getMessagesThread(username: string) {
    const requestUrl = this.apiUrl + 'Messages/thread/' + username;
    return this.http.get<ApiMessageDto[]>(requestUrl);
  }

  sendMessage(username: string, message: string) {
    const requestUrl = this.apiUrl + 'Messages';
    const body = {
      recipientUsername: username,
      content: message,
    }
    return this.http.post<ApiMessageDto>(requestUrl, body);
  }

  deleteMessage(messageId: number) {
    const requestUrl = this.apiUrl + 'Messages/' + messageId;
    return this.http.delete<void>(requestUrl);
  }
}