import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore/firestore';
import { AngularFirestoreCollection } from '@angular/fire/firestore/collection/collection';
import { IUser } from '../models/IUser';
import { environment } from 'src/environments/environment.prod';
import { map, take, switchMap, mergeMap, flatMap, tap } from 'rxjs/operators';
import { Observable, combineLatest, from, EMPTY, of, Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { DocumentReference } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { endpoints } from 'src/environments/endpoints';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userCollection: AngularFirestoreCollection<IUser>;
  public get UserCollection() {
    return this.userCollection;
  }

  constructor(
    private authService: AuthService,
    private afStore: AngularFirestore,
    private platform: Platform
  ) {
    this.platform.ready().then(() => {
      this.userCollection = this.afStore.collection<IUser>(
        environment.endpoints.users
      );
    });
  }

  public NewUser(phone: string): IUser {
    const user: IUser = {
      nickname: null,
      pictureUrl: null,
      email: null,
      phone: phone,
      createdAt: Date.now().toString(),
      uid: this.authService.CurrentUserId,
      friendIdList: []
    };
    return user;
  }

  public get GetCurrentFriends$(): Observable<IUser[]> {
    return this.GetCurrentUser$().pipe(
      switchMap(user => {
        return this.GetUsers$(user.friendIdList);
      })
    );
  }

  public get GetCurrentFriendsWatch$(): Observable<IUser[]> {
    return this.GetCurrentUser$().pipe(
      switchMap(user => {
        return this.GetUsersWatch$(user.friendIdList);
      })
    );
  }

  public User$(userId): Observable<IUser> {
    return this.afStore
      .collection<IUser>(environment.endpoints.users)
      .doc<IUser>(userId)
      .snapshotChanges()
      .pipe(
        map(a => {
          const data = a.payload.data() as IUser;
          const id = a.payload.id;
          return { id, ...data };
        })
      );
  }

  public UserWatch$(uid) {
    return this.afStore
      .collection<IUser>(environment.endpoints.users)
      .doc<IUser>(uid)
      .valueChanges();
  }

  public UserCollectionExist$(): Observable<boolean> {
    return this.afStore
      .collection(environment.endpoints.users)
      .doc(this.authService.CurrentUserId)
      .get()
      .pipe(map(user => user.exists));
  }

  public GetCurrentUser$(): Observable<IUser> {
    if (!this.authService.IsAuthenticated) {
      return of(null);
    }
    return this.afStore
      .collection(environment.endpoints.users)
      .doc(this.authService.CurrentUserId)
      .get()
      .pipe(map(doc => doc.data() as IUser));
  }

  public AddUser(user: IUser) {
    return this.afStore
      .collection(environment.endpoints.users)
      .doc(user.uid)
      .set({
        ...user
      });
  }

  public UpdateUser(user: IUser) {
    this.afStore
      .collection(environment.endpoints.users)
      .doc(user.uid)
      .update({
        ...user
      });
  }

  public GetUsers$(userIdList: string[] = []): Observable<IUser[]> {
    const userDocs = userIdList.map(id => this.User$(id));
    const combined = combineLatest(userDocs);
    return combined;
  }
  public GetUsersWatch$(userIdList: string[]): Observable<IUser[]> {
    const userDocs = userIdList.map(id => this.UserWatch$(id));
    const combined = combineLatest(userDocs);
    return combined;
  }

  // TODO Where nickname is not him self
  public getOtherUserByNickName(nickname: string): Observable<IUser[]> {
    return this.afStore
      .collection<IUser>(environment.endpoints.users, ref =>
        ref.where('nickname', '==', nickname)
      )
      .valueChanges();
  }
}
