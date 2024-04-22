import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';

import { StateUserFacade } from 'src/state-user';

@Component({
  selector: 'app-members-details',
  templateUrl: './members-details.component.html',
  styleUrls: ['./members-details.component.scss']
})
export class MembersDetailsComponent implements OnInit {
  readonly loading$ = this.userFacade.loading$;
  readonly member$ = this.userFacade.selectedUser$;
  readonly photoUrls$ = this.member$.pipe(map((member) =>
    member?.photos.map((photo) => photo.url) ?? []));

  constructor(
    private readonly userFacade: StateUserFacade,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe() // implement ngondestroy
      .subscribe((paramMap) => {
        var username = paramMap.get('username');
        if (!username) return;
        this.userFacade.loadUser(username);
      });
  }
}
