import { Component } from '@angular/core';

import { StateUserFacade } from 'src/state-user';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss']
})
export class MembersListComponent {
  members$ = this.userFacade.allUsers$;

  constructor(
    private readonly userFacade: StateUserFacade,
  ) {}
}
