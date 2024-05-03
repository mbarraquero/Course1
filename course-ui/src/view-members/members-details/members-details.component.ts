import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { first, map, Subject, takeUntil, withLatestFrom } from 'rxjs';

import { StateUserFacade, User } from 'src/state-user';

@Component({
  selector: 'app-members-details',
  templateUrl: './members-details.component.html',
  styleUrls: ['./members-details.component.scss']
})
export class MembersDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('memberTabs') memberTabs?: TabsetComponent;

  readonly loading$ = this.userFacade.loading$;
  readonly error$ = this.userFacade.error$;
  readonly member$ = this.userFacade.selectedUser$;
  readonly photoUrls$ = this.member$.pipe(map((member) =>
    member?.photos.map((photo) => photo.url) ?? []));
  readonly messages$ = this.userFacade.messages$;

  username?: string;
  private messagesLoaded = false;
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly userFacade: StateUserFacade,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((paramMap) => {
        this.username = paramMap.get('username') ?? undefined;
        if (!this.username) return;
        this.userFacade.loadUser(this.username);
      });
    this.member$
      .pipe(
        first((member) => !!member),
        withLatestFrom(this.route.queryParams)
      )
      .subscribe(([_, paramMap]) => {
        const tab = paramMap['tab'];
        if (!tab) return;
        setTimeout(() => { // wait for tabs to be rendered
          this.selectTab(tab);
          this.router.navigate([], { queryParams: {} });
        });
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  selectTab(heading: string) {
    const selectedTab = this.memberTabs?.tabs.find((tab) => tab.heading === heading);
    if (!selectedTab) return;
    selectedTab.active = true;
  }

  onMessagesSelect() {
    if (this.messagesLoaded || !this.username) return;
    this.userFacade.loadUserMessagesThread(this.username);
    this.messagesLoaded = true;
  }

  onMessageSent(message: string, member: User) {
    this.userFacade.sendMessage(member.userName, message);
  }
}
