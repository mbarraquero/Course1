import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';

import { Message } from 'src/state-user';

@Component({
  selector: 'app-members-messages',
  templateUrl: './members-messages.component.html',
  styleUrls: ['./members-messages.component.scss']
})
export class MembersMessagesComponent implements AfterViewInit, OnChanges {
  @Input() loading = false;
  @Input() error?: any;
  @Input() username?: string;
  @Input() messages?: Message[];
  @Output() messageSent = new EventEmitter<string>();

  @ViewChild('chatScroll') private readonly chatScrollRef!: ElementRef;
  scrollTo = 0;

  message = '';

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes['loading']?.currentValue && changes['loading']?.previousValue) {
      if (!this.error) this.message = '';
    }
    if (changes['messages']?.currentValue?.length !== changes['messages']?.previousValue?.length) {
      this.scrollToBottom();
    }
  }

  trackByFn(_: number, message: Message) {
    return message.id;
  }

  send() {
    this.messageSent.emit(this.message);
  }

  private scrollToBottom(timeout?: number) {
    try {
      setTimeout(
        () => { this.scrollTo = this.chatScrollRef?.nativeElement?.scrollHeight; },
        timeout);
    } catch (error) {
      console.log(error);
    }
  }
}
