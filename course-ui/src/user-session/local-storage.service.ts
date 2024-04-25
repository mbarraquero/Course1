import { Injectable } from '@angular/core';

export const LocalStorageKeys = {
  authToken: 'auth-token',
  user: 'user',
};

@Injectable()
export class LocalStorageService {

  save(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  saveObj<T extends object>(key: string, value: T) {
    const objJson = JSON.stringify(value);
    localStorage.setItem(key, objJson);
  }

  get(key: string) {
    return localStorage.getItem(key);
  }

  getObj<T extends object>(key: string) {
    const objJson = localStorage.getItem(key);
    return !!objJson ? JSON.parse(objJson) as T : undefined;
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }

  clearAll() {
    localStorage.clear();
  }
}
