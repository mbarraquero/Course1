import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Subject, takeUntil } from 'rxjs';

import { LikesPredicate, StateUserFacade } from 'src/state-user';

@Component({
  selector: 'app-view-lists',
  templateUrl: './view-lists.component.html',
  styleUrls: ['./view-lists.component.scss']
})
export class ViewListsComponent implements OnInit, OnDestroy {
  readonly loading$ = this.userFacade.loading$;
  readonly members$ = this.userFacade.likesUsers$;
  readonly pagination$ = this.userFacade.likesPagination$;

  pageNumber: number = 1;
  predicate: LikesPredicate = 'liked';
  readonly predicateOpt = [
    { value: 'liked' as LikesPredicate, display: 'Members I like' },
    { value: 'likedBy' as LikesPredicate, display: 'Members who like me' }
  ];
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly userFacade: StateUserFacade,
  ) {}

  ngOnInit() {
    this.pagination$
      .pipe(takeUntil(this.destroy$))
      .subscribe((pagination) => this.pageNumber = pagination.currentPage);
    this.load();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  load() {
    this.userFacade.loadUserLikes(this.predicate);
  }

  pageChanged(event: PageChangedEvent) {
    if (event.page === this.pageNumber) return;
    this.userFacade.goToUserLikesPage(event.page, this.predicate);
  }
}
