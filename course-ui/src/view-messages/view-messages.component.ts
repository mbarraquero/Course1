import { Component } from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Subject, takeUntil } from 'rxjs';

import { Message, MessagesContainer, StateUserFacade } from 'src/state-user';

@Component({
  selector: 'app-view-messages',
  templateUrl: './view-messages.component.html',
  styleUrls: ['./view-messages.component.scss']
})
export class ViewMessagesComponent {
  readonly loading$ = this.userFacade.loading$;
  readonly messages$ = this.userFacade.messages$;
  readonly pagination$ = this.userFacade.messagesPagination$;

  pageNumber: number = 1;
  container: MessagesContainer = 'Unread';
  readonly containerOpt = [
    { value: 'Unread' as MessagesContainer, display: 'Unread', icon: 'envelope' },
    { value: 'Inbox' as MessagesContainer, display: 'Inbox', icon: 'envelope-open' },
    { value: 'Outbox' as MessagesContainer, display: 'Outbox', icon: 'paper-plane' },
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
    this.userFacade.loadUserMessages(this.container);
  }

  pageChanged(event: PageChangedEvent) {
    if (event.page === this.pageNumber) return;
    this.userFacade.goToUserMessagesPage(event.page, this.container);
  }

  getMessageUser(message: Message) {
    return this.container === 'Outbox' ? message.recipient : message.sender;
  }

  deleteMessage(event: Event, message: Message) {
    event.stopPropagation();
    this.userFacade.deleteMessage(message);
  }
}
