import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { LocalStorageKeys, LocalStorageService } from './local-storage.service';

@Injectable()
export class UserSessionInterceptor implements HttpInterceptor {

  constructor(
    private readonly localStorage: LocalStorageService,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.handleRequest(request, next).pipe(
      catchError((error) => {
        if (error.status !== 401) return throwError(() => error);
        alert('TODO: Unauthorized');
        return throwError(() => error);
      })
    );
  }

  private handleRequest(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const authToken = this.localStorage.get(LocalStorageKeys.authToken);
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${authToken}`});
    const actualRequest = request.clone({ headers })
    return next.handle(actualRequest);
  }
}
