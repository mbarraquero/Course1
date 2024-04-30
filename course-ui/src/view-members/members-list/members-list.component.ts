import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Subject, takeUntil } from 'rxjs';

import { StateUserFacade, UserOrderBy, UsersFilters } from 'src/state-user';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss']
})
export class MembersListComponent implements OnInit, OnDestroy {
  readonly members$ = this.userFacade.allUsers$;
  readonly pagination$ = this.userFacade.pagination$;
  readonly filters$ = this.userFacade.filters$;

  pageNumber: number = 1;
  filters: UsersFilters = {};
  readonly genderOpt = [
    { value: 'female', display: 'Females' },
    { value: 'male', display: 'Males' },
  ];
  readonly sortingOpt = [
    { value: 'lastActive' as UserOrderBy, display: 'Last Active' },
    { value: 'created' as UserOrderBy, display: 'Newest Member' }
  ];
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly userFacade: StateUserFacade,
  ) {}

  ngOnInit() {
    this.pagination$
      .pipe(takeUntil(this.destroy$))
      .subscribe((pagination) => this.pageNumber = pagination.currentPage);
    this.filters$
      .pipe(takeUntil(this.destroy$))
      .subscribe((filters) => this.filters = { ...filters });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  pageChanged(event: PageChangedEvent) {
    if (event.page === this.pageNumber) return;
    this.userFacade.goToUserPage(event.page);
  }

  setFilters() {
    this.userFacade.setFilters(this.filters);
  }

  resetFilters() {
    this.userFacade.resetFilters();
  }
}
