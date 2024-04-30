import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { StateUserFacade, User } from 'src/state-user';

@Component({
  selector: 'app-util-member-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './util-member-card.component.html',
  styleUrls: ['./util-member-card.component.scss']
})
export class UtilMemberCardComponent {
  @Input() member?: User;

  constructor(
    private readonly userFacade: StateUserFacade,
  ) {}

  like(member: User) {
    this.userFacade.like(member);
  }
}
