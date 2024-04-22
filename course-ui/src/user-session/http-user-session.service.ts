import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';

import { ApiLoginDto, ApiRegisterDto, ApiUserDto } from './http-user-session.models';

@Injectable()
export class HttpUserSessionService {
  private readonly apiUrl = environment.apiUrl;

  private http: HttpClient;

  constructor(
    httpBackend: HttpBackend
  ) {
    this.http = new HttpClient(httpBackend) // overrides interceptor
  }

  register(registerData: ApiRegisterDto) {
    const requestUrl = this.apiUrl + 'Account/register';
    return this.http.post<ApiUserDto>(requestUrl, registerData);
  }

  login(loginData: ApiLoginDto) {
    const requestUrl = this.apiUrl + 'Account/login';
    return this.http.post<ApiUserDto>(requestUrl, loginData);
  }
}
