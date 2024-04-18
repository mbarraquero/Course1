import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ApiUserDto } from './http-user-session.models';
import { HttpUserSessionService } from './http-user-session.service';
import { LocalStorageService } from './local-storage.service';
import { UserSessionService } from './user-session.service';

describe('UserSessionService', () => {
  let service: UserSessionService;
  const mockUser: ApiUserDto = {
    username: 'Test User',
    token: 'ey123456789',
  };
  const mockApi: Partial<HttpUserSessionService> = {
    register: jasmine.createSpy().and.returnValue(of(mockUser)),
    login: jasmine.createSpy().and.returnValue(of(mockUser))
  };
  const mockLocalStorage: Partial<LocalStorageService> = {
    get: jasmine.createSpy().and.returnValue(''),
    save: jasmine.createSpy(),
    remove: jasmine.createSpy(),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserSessionService,
        {
          provide: HttpUserSessionService,
          useValue: mockApi,
        },
        {
          provide: LocalStorageService,
          useValue: mockLocalStorage,
        },
      ],
    });
    service = TestBed.inject(UserSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
