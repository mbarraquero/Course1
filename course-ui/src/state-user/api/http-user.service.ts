import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ApiMemberDto } from './http-user.models';

@Injectable()
export class HttpUserService {
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private readonly http: HttpClient
  ) {}

  getUsers() {
    const requestUrl = this.apiUrl + 'Users';
    return this.http.get<ApiMemberDto[]>(requestUrl)
      .pipe(map((response) => response));
  }

  getUserByName(username: string) {
    const requestUrl = this.apiUrl + 'Users/' + username;
    return this.http.get<ApiMemberDto>(requestUrl)
      .pipe(map((response) => response));
  }
}