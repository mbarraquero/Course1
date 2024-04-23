import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Subject, takeUntil } from 'rxjs';

import { StateUserFacade } from 'src/state-user';

@Component({
  selector: 'app-members-details',
  templateUrl: './members-details.component.html',
  styleUrls: ['./members-details.component.scss']
})
export class MembersDetailsComponent implements OnInit, OnDestroy {
  readonly loading$ = this.userFacade.loading$;
  readonly member$ = this.userFacade.selectedUser$;
  readonly photoUrls$ = this.member$.pipe(map((member) =>
    member?.photos.map((photo) => photo.url) ?? []));
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly userFacade: StateUserFacade,
    private readonly route: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((paramMap) => {
        var username = paramMap.get('username');
        if (!username) return;
        this.userFacade.loadUser(username);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
