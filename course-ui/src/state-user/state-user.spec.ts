
import { NgModule } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { EffectsModule } from '@ngrx/effects';
import { Store, StoreModule } from '@ngrx/store';
import { combineLatest, of, Subject, take } from 'rxjs';

import { ApiUser } from './api/http-user.models';
import { HttpUserService } from './api/http-user.service';

import { UserEffects } from './state-user.effects';
import { StateUserFacade } from './state-user.facade';
import { User } from './state-user.models';
import { State, userFeatureKey, userReducer } from './state-user.reducer';

interface TestSchema {
  [userFeatureKey]: State
}

describe('User state', () => {
  let facade: StateUserFacade;
  const mockUsers: User[] = [
    {
      id: 1,
      userName: 'John Bar'
    },
    {
      id: 2,
      userName: 'Foo Doe',
    },
  ];
  const toApiUser = (user: User) => ({
    id: user.id,
    userName: user.userName,
  } as ApiUser);
  const mockError = { description: 'Failure!' };

  let store: Store<TestSchema>;
  let mockApi: Partial<HttpUserService>;

  beforeEach(() => {
    mockApi = {
      getUsers: jasmine.createSpy().and.returnValue(of([] as User[]))
    };

    @NgModule({
      imports: [
        StoreModule.forFeature(userFeatureKey, userReducer),
        EffectsModule.forFeature([UserEffects]),
      ],
      providers: [
        StateUserFacade,
        {
          provide: HttpUserService,
          useValue: mockApi,
        }
      ]
    })
    class CustomFeatureModule {}

    @NgModule({
      imports: [StoreModule.forRoot({}), EffectsModule.forRoot([]), CustomFeatureModule]
    })
    class RootModule {}

    TestBed.configureTestingModule({ imports: [RootModule] });
    store = TestBed.inject(Store);
    facade = TestBed.inject(StateUserFacade);
  });

  describe('initialState', () => {
    it('initializes selectors', (done) => {
      combineLatest([facade.loaded$, facade.loading$, facade.error$])
        .pipe(take(1))
        .subscribe(([loaded, loading, error]) => {
          expect(loaded).toBe(false);
          expect(loading).toBe(false);
          expect(error).toBe(undefined);
          done();
        })
    });
  });

  describe('#init', () => {
    let getUsersSubj: Subject<ApiUser[]>;
    beforeEach(() => {
      getUsersSubj = new Subject<ApiUser[]>();
      mockApi.getUsers = jasmine.createSpy().and.returnValue(getUsersSubj.asObservable());
    });

    it('calls getUsers and updates selectors', (done) => {
      facade.init();
      facade.loading$
        .pipe(take(1))
        .subscribe((loading) => {
          expect(mockApi.getUsers).toHaveBeenCalled();
          expect(loading).toBe(true);
          done();
        });
    });

    describe('on getUserId success', () => {
      it('updates selectors', (done) => {
        facade.init();
        getUsersSubj.next(mockUsers.map(toApiUser));
        combineLatest([facade.loading$, facade.allUsers$])
          .pipe(take(1))
          .subscribe(([loading, allUsers]) => {
            expect(loading).toBe(false);
            expect(allUsers).toBe(mockUsers);
            done();
          });
      });
    });

    describe('on getUserId failure', () => {
      it('updates selectors', (done) => {
        facade.init();
        getUsersSubj.error(mockError);
        combineLatest([facade.loading$, facade.error$])
          .pipe(take(1))
          .subscribe(([loading, error]) => {
            expect(loading).toBe(false);
            expect(error).toBe(mockError);
            done();
          });
      });
    });
  });
});