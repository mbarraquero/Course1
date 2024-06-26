import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';

import { ApiRole, ApiUserDto } from 'src/api-models';
import { PresenceHubService } from 'src/hub';

import { HttpUserSessionService } from './http-user-session.service';
import { LocalStorageKeys, LocalStorageService } from './local-storage.service';

@Injectable()
export class UserSessionService {
  private readonly loadedSubj = new BehaviorSubject(false);
  private readonly loadingSubj = new BehaviorSubject(false);
  private readonly errorSubj = new BehaviorSubject<any>(undefined);
  private readonly userSubj = new BehaviorSubject<ApiUserDto | undefined>(undefined);

  readonly loaded$ = this.loadedSubj.asObservable();
  readonly loading$ = this.loadingSubj.asObservable();
  readonly error$ = this.errorSubj.asObservable();
  private readonly user$ = this.userSubj.asObservable();
  readonly loggedIn$ = this.user$.pipe(map((user) => !!user));
  readonly userName$ = this.user$.pipe(map((user) => user?.username));
  readonly userKnownAs$ = this.user$.pipe(map((user) => user?.knownAs));
  readonly userPhotoUrl$ = this.user$.pipe(map((user) => user?.photoUrl));
  readonly userGender$ = this.user$.pipe(map((user) => user?.gender));
  readonly userRoles$ = this.user$.pipe(map((user) =>
    user ? this.getUserRoles(user) : []
  ));
  
  constructor(
    private readonly api: HttpUserSessionService,
    private readonly localStorage: LocalStorageService,
    private readonly presenceHub: PresenceHubService,
  ) {}

  init() {
    this.loadingSubj.next(true);
    const user = this.localStorage.getObj<ApiUserDto>(LocalStorageKeys.user);
    const token = this.localStorage.get(LocalStorageKeys.authToken);
    if (user && token) {
      this.userSubj.next(user);
      this.presenceHub.createConnection(token);
    }
    this.loadedSubj.next(true);
    this.loadingSubj.next(false);
  }

  register(newUser: {
    username: string;
    knownAs: string;
    gender: string;
    dateOfBirth: string;
    city: string;
    country: string;
    password: string;
  }) {
    this.onLoginStart();
    this.api.register(newUser)
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
    this.localStorage.remove(LocalStorageKeys.user);
    this.localStorage.remove(LocalStorageKeys.authToken);
    this.userSubj.next(undefined);
    this.presenceHub.stopConnection();
  }

  getToken() {
    return this.localStorage.get(LocalStorageKeys.authToken);
  }

  onUserPhotoUrlUpdated(userPhotoUrl: string) {
    const user = this.localStorage.getObj<ApiUserDto>(LocalStorageKeys.user);
    if (!user) return;
    user.photoUrl = userPhotoUrl;
    this.localStorage.saveObj(LocalStorageKeys.user, user);
    this.userSubj.next(user);
  }

  private onLoginStart() {
    this.loadingSubj.next(true);
    this.errorSubj.next(undefined);
  }

  private onLoginSuccess(user: ApiUserDto) {
    this.localStorage.saveObj(LocalStorageKeys.user, user);
    this.localStorage.save(LocalStorageKeys.authToken, user.token);
    this.userSubj.next(user);
    this.presenceHub.createConnection(user.token);
    this.loadingSubj.next(false);
  }

  private onLoginError(error: any) {
    this.errorSubj.next(error);
    this.loadingSubj.next(false);
  }

  private getUserRoles(user: ApiUserDto) {
    const token = this.getDecodedToken(user.token);
    const roles: ApiRole | ApiRole[] = token.role;
    return Array.isArray(roles) ? roles : [roles];
  }

  private getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  }
}
