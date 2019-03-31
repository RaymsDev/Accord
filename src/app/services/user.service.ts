import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore/firestore';
import { AngularFirestoreCollection } from '@angular/fire/firestore/collection/collection';
import { IUser } from '../models/IUser';
import { environment } from 'src/environments/environment.prod';
import { map, take, switchMap, mergeMap, flatMap } from 'rxjs/operators';
import { Observable, combineLatest, from, EMPTY } from 'rxjs';
import { AuthService } from './auth.service';
import { DocumentReference } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { endpoints } from 'src/environments/endpoints';

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
    private afStore: AngularFirestore
  ) {
    this.userCollection = this.afStore.collection<IUser>(
      environment.endpoints.users
    );
  }

  public get CurrentUser$(): Observable<IUser> {
    return this.authService.userObservable.pipe(
      mergeMap(user => {
        if (!user) {
          return EMPTY;
        }
        return this.User$(user.uid);
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

  public UserCollectionExist(): Promise<Boolean> {
    return this.afStore
      .collection(environment.endpoints.users)
      .doc(this.authService.currentUserId)
      .get()
      .pipe(map(user => user.exists))
      .toPromise<boolean>();
  }

  public getNewUserInit(): IUser {
    const user: IUser = {
      nickname: null,
      pictureUrl: null,
      email: null,
      createdAt: Date.now().toString(),
      uid: this.authService.currentUserId,
      friends: new Array<DocumentReference>()
    };
    return user;
  }

  public GetCurrentUser(): Observable<IUser> {
    return this.afStore
      .collection(environment.endpoints.users)
      .doc(this.authService.user.uid)
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

  public GetUsers(userIdList: string[]): Observable<IUser[]> {
    const userDocs = userIdList.map(id => this.User$(id));
    const combined = combineLatest(userDocs);
    return combined;
  }

  public get GetCurrentFriends$(): Observable<IUser[]> {
    return this.CurrentUser$.pipe(
      switchMap(user => {
        return this.GetUsers(user.friends.map(f => f.id));
      })
    );
  }
}
