import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

import { ApiUsersWithRoles } from './http-admin.models';

@Injectable()
export class HttpUserService {
  private readonly apiUrl = environment.apiUrl;

  constructor(
    private readonly http: HttpClient,
  ) {}

  getUsersWithRole() {
    const requestUrl = this.apiUrl + 'Admin/users-with-roles';
    return this.http.get<ApiUsersWithRoles[]>(requestUrl);
  }

  updateUserRoles(userUpdate: ApiUsersWithRoles) {
    const requestUrl = this.apiUrl + 'Admin/edit-roles/' + userUpdate.username;
    let params = new HttpParams()
      .append('roles', userUpdate.roles.join(','));
    return this.http.post<string[]>(requestUrl, {}, { params });
  }
}