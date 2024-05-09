import { HubConnection } from '@microsoft/signalr';
import { BehaviorSubject, Subject } from 'rxjs';

export function setSubjectToListen<T>(hubConnection: HubConnection, method: string, subj: Subject<T>) {
  hubConnection.on(method, (args) => subj.next(args));
}

export function resetSubject<T>(subj: Subject<T>) {
  subj.complete();
  return new Subject<T>();
}

export function resetBehaviorSubject<T>(subj: BehaviorSubject<T>, defaultValue: T) {
  subj.complete();
  return new BehaviorSubject<T>(defaultValue);
}