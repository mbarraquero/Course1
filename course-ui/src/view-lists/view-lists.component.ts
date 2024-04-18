import { Component } from '@angular/core';
import { StateUserFacade } from 'src/state-user';

@Component({
  selector: 'app-view-lists',
  templateUrl: './view-lists.component.html',
  styleUrls: ['./view-lists.component.scss']
})
export class ViewListsComponent {
  users$ = this.userFacade.allUsers$;

  constructor(
    private readonly userFacade: StateUserFacade,
  ) {}
}
