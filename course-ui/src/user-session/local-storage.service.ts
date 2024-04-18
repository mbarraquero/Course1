import { Injectable } from '@angular/core';

export const LocalStorageKeys = {
  authToken: 'auth-token',
  username: 'user-name',
};

@Injectable()
export class LocalStorageService {

  save(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  get(key: string) {
    return localStorage.getItem(key);
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }

  clearAll() {
    localStorage.clear();
  }
}
