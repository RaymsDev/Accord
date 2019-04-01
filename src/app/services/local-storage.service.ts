import { Injectable } from '@angular/core';

const key = 'CurrentUserId';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  constructor() {}
  public get Uid(): string {
    return localStorage.getItem(key);
  }

  public set Uid(uid: string) {
    localStorage.setItem(key, uid);
  }

  public RemoveUid() {
    localStorage.removeItem(key);
  }
}
