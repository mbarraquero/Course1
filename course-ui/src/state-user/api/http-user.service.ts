import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiUser } from './http-user.models';

@Injectable()
export class HttpUserService {
  private readonly apiUrl = 'https://localhost:44349/';

  constructor(
    private readonly http: HttpClient
  ) {}

  getUsers() {
    const requestUrl = this.apiUrl + 'api/users';
    return this.http.get<ApiUser[]>(requestUrl)
      .pipe(map((response) => response));
  }

  getUser(userId: number) {
    const requestUrl = this.apiUrl + 'api/users/' + userId;
    return this.http.get<ApiUser>(requestUrl)
      .pipe(map((response) => response));
  }
}