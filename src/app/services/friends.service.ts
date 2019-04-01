import { Injectable } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Observable, zip, of, from, concat, combineLatest } from 'rxjs';
import { UserService } from './user.service';
import { IUser } from '../models/IUser';
import { map, mergeMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {
  constructor(
    private afStore: AngularFirestore,
    private userService: UserService,
    private taoastController: ToastController
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
    this.addFriend(friendUid).subscribe(async () => {
      const toast = await this.taoastController.create({
        duration: 3000,
        message: 'Friend added!',
        color: 'secondary'
      });
      toast.present();
    });
  }

  public addFriend(uid: string) {
    return this.userService.GetCurrentUser$().pipe(
      tap(user => {
        return this.userService.UpdateUser({
          ...user,
          friendIdList: [...user.friendIdList, uid]
        });
      })
    );
  }
  public removeFriend(uid: string) {
    return this.userService.GetCurrentUser$().pipe(
      tap(user => {
        return this.userService.UpdateUser({
          ...user,
          friendIdList: [...user.friendIdList.filter(fuid => fuid !== uid)]
        });
      })
    );
  }
}
