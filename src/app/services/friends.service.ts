import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Observable, zip, of, from, concat } from 'rxjs';
import { UserService } from './user.service';
import { IUser } from '../models/IUser';
import { map, combineLatest, switchMap, concatMap, mergeMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class FriendsService {



  constructor(private plt: Platform, private authService: AuthService, private afStore: AngularFirestore,
    private userService: UserService) { }

  public getMyFriend(): Observable<IUser[]> {
    return this.userService.GetCurrentFriends$;
  }

  public searchFriendByNickName(nickname: string): Observable<IUser[]> {
    return this.userService.getOtherUserByNickName(nickname);
  }

  public getContactByPhoneNumber(phonesNumber: string[]) {
    return of(phonesNumber).pipe(
      // mergeMap
      mergeMap(
        (numbers) => {
          return numbers.map(number => this.getContactToOnePhoneNumber(number));
        }
      )
    );
  }

  public getContactToOnePhoneNumber(phoneNumber): Observable<IUser> {
    return this.afStore.collection<IUser>(environment.endpoints.users, ref =>
      ref.where('phone', '==', phoneNumber)).valueChanges()
      .pipe(map(user => user[0]));
  }

  public addToMyFriendByUid(friendUid) {
    this.userService.addFriend(friendUid);
  }




}
