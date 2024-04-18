import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { StateUserFacade } from 'src/state-user';
import { UserSessionService } from 'src/user-session';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  const mockUserSessionService: Partial<UserSessionService> = {
    loading$: of(false),
    loggedIn$: of(false),
  };
  const mockUserFacade: Partial<StateUserFacade> = {
    init: jasmine.createSpy(),
  };

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      RouterTestingModule
    ],
    declarations: [AppComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [
      {
        provide: UserSessionService,
        useValue: mockUserSessionService
      },
      {
        provide: StateUserFacade,
        useValue: mockUserFacade
      },
    ],
  }));

  // beforeEach(() => {
  //   fixture = TestBed.createComponent(AppComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  // });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'course-ui'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('course-ui');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.content span')?.textContent).toContain('course-ui app is running!');
  });
});
