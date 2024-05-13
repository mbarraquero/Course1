import { Component, OnInit } from '@angular/core';
import { filter, withLatestFrom } from 'rxjs';

import { StateUserFacade } from 'src/state-user';
import { UserSessionService } from 'src/user-session';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private readonly userSessionService: UserSessionService,
    private readonly userFacade: StateUserFacade,
  ) {}

  ngOnInit() {
    this.userSessionService.loading$
      .pipe(
        filter((loading) => !loading),
        withLatestFrom(this.userSessionService.loggedIn$)
      )
      .subscribe(([_, loggedIn]) => {
        if (loggedIn) this.userFacade.init();
      });
  }
}
