import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

import { ApiUserDto } from './http-user-session.models';
import { HttpUserSessionService } from './http-user-session.service';
import { LocalStorageKeys, LocalStorageService } from './local-storage.service';

@Injectable()
export class UserSessionService {
  private readonly loadedSubj = new BehaviorSubject(false);
  private readonly loadingSubj = new BehaviorSubject(false);
  private readonly errorSubj = new BehaviorSubject<any>(undefined);
  private readonly userNameSubj = new BehaviorSubject<string | undefined>(undefined);
  private readonly userPhotoUrlSubj = new BehaviorSubject<string | undefined>(undefined);

  readonly loaded$ = this.loadedSubj.asObservable();
  readonly loading$ = this.loadingSubj.asObservable();
  readonly error$ = this.errorSubj.asObservable();
  readonly loggedIn$ = this.userNameSubj.asObservable().pipe(map((username) => !!username));
  readonly userName$ = this.userNameSubj.asObservable();
  readonly userPhotoUrl$ = this.userPhotoUrlSubj.asObservable();
  
  constructor(
    private readonly api: HttpUserSessionService,
    private readonly localStorage: LocalStorageService,
  ) { }

  init() {
    this.loadingSubj.next(true);
    const username = this.localStorage.get(LocalStorageKeys.username);
    const userPhotoUrl = this.localStorage.get(LocalStorageKeys.userPhotoUrl);
    const token = this.localStorage.get(LocalStorageKeys.authToken);
    if (username && token) {
      this.userNameSubj.next(username);
      this.userPhotoUrlSubj.next(userPhotoUrl ?? undefined);
    }
    this.loadedSubj.next(true);
    this.loadingSubj.next(false);
  }

  register(username: string, password: string) {
    this.onLoginStart();
    this.api.register({ username, password })
      .subscribe({
        next: (user) => this.onLoginSuccess(user),
        error: (error) => this.onLoginError(error),
      });
  }

  login(username: string, password: string) {
    this.onLoginStart();
    this.api.login({ username, password })
      .subscribe({
        next: (user) => this.onLoginSuccess(user),
        error: (error) => this.onLoginError(error),
      });
  }

  logout() {
    this.localStorage.remove(LocalStorageKeys.username);
    this.localStorage.remove(LocalStorageKeys.userPhotoUrl);
    this.localStorage.remove(LocalStorageKeys.authToken);
    this.userNameSubj.next(undefined);
    this.userPhotoUrlSubj.next(undefined);
  }

  getToken() {
    return this.localStorage.get(LocalStorageKeys.authToken);
  }

  onUserPhotoUrlUpdated(userPhotoUrl: string) {
    this.localStorage.save(LocalStorageKeys.userPhotoUrl, userPhotoUrl);
    this.userPhotoUrlSubj.next(userPhotoUrl);
  }

  private onLoginStart() {
    this.loadingSubj.next(true);
    this.errorSubj.next(undefined);
  }

  private onLoginSuccess(user: ApiUserDto) {
    this.localStorage.save(LocalStorageKeys.username, user.username);
    this.localStorage.save(LocalStorageKeys.authToken, user.token);
    this.userNameSubj.next(user.username);
    this.loadingSubj.next(false);
    this.onUserPhotoUrlUpdated(user.photoUrl);
  }

  private onLoginError(error: any) {
    this.errorSubj.next(error);
    this.loadingSubj.next(false);
  }
}
