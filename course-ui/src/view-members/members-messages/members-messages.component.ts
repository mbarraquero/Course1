import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Message } from 'src/state-user';

@Component({
  selector: 'app-members-messages',
  templateUrl: './members-messages.component.html',
  styleUrls: ['./members-messages.component.scss']
})
export class MembersMessagesComponent implements OnChanges {
  @Input() loading = false;
  @Input() error?: any;
  @Input() username?: string;
  @Input() messages?: Message[];
  @Output() messageSent = new EventEmitter<string>();

  message = '';

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['loading'].currentValue && changes['loading'].previousValue) {
      if (!this.error) this.message = '';
    }
  }

  trackByFn(_: number, message: Message) {
    return message.id;
  }

  send() {
    this.messageSent.emit(this.message);
  }
}
