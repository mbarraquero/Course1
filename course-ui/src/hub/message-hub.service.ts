import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { from, of, Subject, withLatestFrom } from 'rxjs';

import { ApiCreateMessageDto, ApiMessageDto } from 'src/api-models';
import { environment } from 'src/environments/environment';
import { ErrorService } from 'src/error';

import { resetSubject, setSubjectToListen } from './util';

@Injectable()
export class MessageHubService {
  private readonly hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection;

  private messageThreadSubj = new Subject<ApiMessageDto[]>();
  get messageThread$() { return this.messageThreadSubj.asObservable(); }
  private newMessageSubj = new Subject<ApiMessageDto>();
  get newMessage$() { return this.newMessageSubj.asObservable(); }
  private messagesReadSubj = new Subject<ApiMessageDto[]>();
  get messagesRead$() { return this.messagesReadSubj.asObservable(); }

  constructor(
    private readonly errorService: ErrorService,
  ) { }

  createConnection(token: string, otherUsername: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(
        this.hubUrl + 'message?user=' + otherUsername,
        { accessTokenFactory: () => token }
      )
      .withAutomaticReconnect()
      .build();
    this.hubConnection.start().catch((error) => this.errorService.handleError(error));
    setSubjectToListen(this.hubConnection, 'ReceiveMessageThread', this.messageThreadSubj);
    setSubjectToListen(this.hubConnection, 'NewMessage', this.newMessageSubj);
    setSubjectToListen(this.hubConnection, 'MessagesRead', this.messagesReadSubj);
    this.newMessage$
      .pipe(withLatestFrom(this.messageThread$))
      .subscribe(([newMessage, messageThread]) => this.messageThreadSubj.next(
        [...messageThread, newMessage]
      ));
    this.messagesRead$
      .pipe(withLatestFrom(this.messageThread$))
      .subscribe(([messagesRead, messageThread]) => this.messageThreadSubj.next(
        messageThread.map((message) =>
          messagesRead.find((read) => read.id == message.id) ?? message
        )
      ));
  }

  sendMessage(username: string, message: string) {
    const args: ApiCreateMessageDto = {
      recipientUsername: username,
      content: message,
    };
    return this.hubConnection
      ? from(this.hubConnection?.invoke<void>('SendMessage', args))
      : of(undefined);
  }

  stopConnection() {
    this.hubConnection?.stop().catch((error) => this.errorService.handleError(error));
    this.messageThreadSubj = resetSubject(this.messageThreadSubj);
    this.newMessageSubj = resetSubject(this.newMessageSubj);
    this.messagesReadSubj = resetSubject(this.messagesReadSubj);
  }
}
