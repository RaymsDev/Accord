import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Observable, zip, of, from, concat, combineLatest } from 'rxjs';
import { UserService } from './user.service';
import { IUser } from '../models/IUser';
import { map, mergeMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {
  constructor(
    private afStore: AngularFirestore,
    private userService: UserService
  ) {}

  public getMyFriend(): Observable<IUser[]> {
    return this.userService.GetCurrentFriends$;
  }

  public searchFriendByNickName(nickname: string): Observable<IUser[]> {
    return this.userService.getOtherUserByNickName(nickname);
  }

  public getContactByPhoneNumber(phones: string[]): Observable<IUser[]> {
    const userDocs = phones.map(userId =>
      this.getContactToOnePhoneNumber(userId)
    );
    const combined = combineLatest(userDocs);
    return userDocs.length ? combined : of([]);
  }

  public getContactToOnePhoneNumber(phoneNumber): Observable<IUser> {
    return this.afStore
      .collection<IUser>(environment.endpoints.users, ref =>
        ref.where('phone', '==', phoneNumber)
      )
      .valueChanges()
      .pipe(map(users => (users ? users[0] : null)));
  }

  public addToMyFriendByUid(friendUid) {
    this.userService.addFriend(friendUid);
  }
}
