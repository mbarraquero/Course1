import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, Subject } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ErrorService } from 'src/error';

import { resetBehaviorSubject, resetSubject, setSubjectToListen } from './util';
import { ApiNewMessageReceivedDto } from 'src/api-models';

@Injectable()
export class PresenceHubService {
  private readonly hubUrl = environment.hubUrl;
  private hubConnection?: HubConnection;

  private userOnlineSubj = new Subject<string>();
  get userOnline$() { return this.userOnlineSubj.asObservable(); }
  private userOfflineSubj = new Subject<string>();
  get userOffline$() { return this.userOfflineSubj.asObservable(); }
  private onlineUsersSubj = new BehaviorSubject<string[]>([]);
  get onlineUsers$() { return this.onlineUsersSubj.asObservable(); }
  private newMessageReceivedSubj = new Subject<ApiNewMessageReceivedDto>();
  get newMessageReceived$() { return this.newMessageReceivedSubj.asObservable(); }

  constructor(
    private readonly errorService: ErrorService,
  ) { }

  createConnection(token: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(
        this.hubUrl + 'presence',
        { accessTokenFactory: () => token }
      )
      .withAutomaticReconnect()
      .build();
    this.hubConnection.start().catch((error) => this.errorService.handleError(error));
    setSubjectToListen(this.hubConnection, 'UserOnline', this.userOnlineSubj);
    setSubjectToListen(this.hubConnection, 'UserOffline', this.userOfflineSubj);
    setSubjectToListen(this.hubConnection, 'OnlineUsers', this.onlineUsersSubj);
    setSubjectToListen(this.hubConnection, 'NewMessageReceived', this.newMessageReceivedSubj);
    this.userOnline$.subscribe((userOnline) => this.onlineUsersSubj.next(
      [...this.onlineUsersSubj.value, userOnline]
    ));
    this.userOffline$.subscribe((userOffline) => this.onlineUsersSubj.next(
      [...this.onlineUsersSubj.value].filter((username) => username !== userOffline)
    ));
  }

  stopConnection() {
    this.hubConnection?.stop().catch((error) => this.errorService.handleError(error));
    this.userOnlineSubj = resetSubject(this.userOnlineSubj);
    this.userOfflineSubj = resetSubject(this.userOfflineSubj);
    this.onlineUsersSubj = resetBehaviorSubject(this.onlineUsersSubj, []);
    this.newMessageReceivedSubj = resetSubject(this.newMessageReceivedSubj);
  }
}
