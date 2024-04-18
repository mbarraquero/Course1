import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiLoginDto, ApiRegisterDto, ApiUserDto } from './http-user-session.models';

@Injectable()
export class HttpUserSessionService {
  private readonly apiUrl = 'https://localhost:44349/';

  private http: HttpClient;

  constructor(
    httpBackend: HttpBackend
  ) {
    this.http = new HttpClient(httpBackend) // overrides interceptor
  }

  register(registerData: ApiRegisterDto) {
    const requestUrl = this.apiUrl + 'api/Account/register';
    return this.http.post<ApiUserDto>(requestUrl, registerData);
  }

  login(loginData: ApiLoginDto) {
    const requestUrl = this.apiUrl + 'api/Account/login';
    return this.http.post<ApiUserDto>(requestUrl, loginData);
  }
}
