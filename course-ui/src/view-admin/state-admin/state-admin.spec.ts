
// import { NgModule } from '@angular/core';
// import { TestBed } from '@angular/core/testing';
// import { EffectsModule } from '@ngrx/effects';
// import { Store, StoreModule } from '@ngrx/store';
// import { combineLatest, of, Subject, take } from 'rxjs';

// import { ApiMemberDto } from './api/http-admin.models';
// import { HttpUserService } from './api/http-admin.service';

// import { UserEffects } from './state-admin.effects';
// import { StateUserFacade } from './state-admin.facade';
// import { User } from './state-admin.models';
// import { State, userFeatureKey, userReducer } from './state-admin.reducer';

// interface TestSchema {
//   [userFeatureKey]: State
// }

// describe('User state', () => {
//   let facade: StateUserFacade;
//   const mockUsers: User[] = [
//     {
//       id: 1,
//       userName: 'John Bar'
//     } as User,
//     {
//       id: 2,
//       userName: 'Foo Doe',
//     } as User,
//   ];
//   const toApiUser = (user: User) => ({
//     id: user.id,
//     userName: user.userName,
//   } as ApiMemberDto);
//   const mockError = { description: 'Failure!' };

//   let store: Store<TestSchema>;
//   let mockApi: Partial<HttpUserService>;

//   beforeEach(() => {
//     mockApi = {
//       getUsers: jasmine.createSpy().and.returnValue(of([] as User[]))
//     };

//     @NgModule({
//       imports: [
//         StoreModule.forFeature(userFeatureKey, userReducer),
//         EffectsModule.forFeature([UserEffects]),
//       ],
//       providers: [
//         StateUserFacade,
//         {
//           provide: HttpUserService,
//           useValue: mockApi,
//         }
//       ]
//     })
//     class CustomFeatureModule {}

//     @NgModule({
//       imports: [StoreModule.forRoot({}), EffectsModule.forRoot([]), CustomFeatureModule]
//     })
//     class RootModule {}

//     TestBed.configureTestingModule({ imports: [RootModule] });
//     store = TestBed.inject(Store);
//     facade = TestBed.inject(StateUserFacade);
//   });

//   describe('initialState', () => {
//     it('initializes selectors', (done) => {
//       combineLatest([facade.loaded$, facade.loading$, facade.error$])
//         .pipe(take(1))
//         .subscribe(([loaded, loading, error]) => {
//           expect(loaded).toBe(false);
//           expect(loading).toBe(false);
//           expect(error).toBe(undefined);
//           done();
//         })
//     });
//   });

//   describe('#init', () => {
//     let getUsersSubj: Subject<ApiMemberDto[]>;
//     beforeEach(() => {
//       getUsersSubj = new Subject<ApiMemberDto[]>();
//       mockApi.getUsers = jasmine.createSpy().and.returnValue(getUsersSubj.asObservable());
//     });

//     it('calls getUsers and updates selectors', (done) => {
//       facade.init();
//       facade.loading$
//         .pipe(take(1))
//         .subscribe((loading) => {
//           expect(mockApi.getUsers).toHaveBeenCalled();
//           expect(loading).toBe(true);
//           done();
//         });
//     });

//     describe('on getUserId success', () => {
//       it('updates selectors', (done) => {
//         facade.init();
//         getUsersSubj.next(mockUsers.map(toApiUser));
//         combineLatest([facade.loading$, facade.allUsers$])
//           .pipe(take(1))
//           .subscribe(([loading, allUsers]) => {
//             expect(loading).toBe(false);
//             expect(allUsers).toEqual(mockUsers);
//             done();
//           });
//       });
//     });

//     describe('on getUserId failure', () => {
//       it('updates selectors', (done) => {
//         facade.init();
//         getUsersSubj.error(mockError);
//         combineLatest([facade.loading$, facade.error$])
//           .pipe(take(1))
//           .subscribe(([loading, error]) => {
//             expect(loading).toBe(false);
//             expect(error).toBe(mockError);
//             done();
//           });
//       });
//     });
//   });
// });