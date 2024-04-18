import { TestBed } from '@angular/core/testing';

import { LocalStorageService } from './local-storage.service';
import { UserSessionInterceptor } from './user-session.interceptor';

describe('UserSessionInterceptor', () => {
  let interceptor: UserSessionInterceptor;
  const mockLocalStorage: Partial<LocalStorageService> = {
    get: jasmine.createSpy().and.returnValue(''),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserSessionInterceptor,
        {
          provide: LocalStorageService,
          useValue: mockLocalStorage,
        }
      ],
    });
    interceptor = TestBed.inject(UserSessionInterceptor);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
