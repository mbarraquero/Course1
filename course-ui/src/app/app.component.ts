import { Component, OnInit } from '@angular/core';

import { StateUserFacade } from 'src/state-user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'course-ui';

  users$ = this.userFacade.allUsers$;

  constructor(
    private readonly userFacade: StateUserFacade,
  ) {}

  ngOnInit() {
    this.userFacade.init();
  }
}
