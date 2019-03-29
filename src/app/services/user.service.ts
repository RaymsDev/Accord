import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore/firestore';
import { AngularFirestoreCollection } from '@angular/fire/firestore/collection/collection';
import { IUser } from '../models/IUser';
import { environment } from 'src/environments/environment.prod';
import { map, switchMap, flatMap, tap } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { AuthService } from './auth.service';
import { DocumentReference } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userCollection: AngularFirestoreCollection<IUser>;


  constructor(private authService: AuthService, private afStore: AngularFirestore) {
    this.userCollection = this.afStore.collection<IUser>(environment.endpoints.users);
  }

  public get CurrentUser$(): Observable<IUser> {
    return this.authService.userObservable.pipe(
      flatMap(user => this.UserByUid$(user.uid))
    );
  }

  public User$(userId): Observable<IUser> {
    return this.afStore.collection<IUser>(environment.endpoints.users)
      .doc<IUser>(userId)
      .snapshotChanges()
      .pipe(map(a => {
        const data = a.payload.data() as IUser;
        const id = a.payload.id;
        return { id, ...data };
      }));
  }

  public UserByUid$(uid: string): Observable<IUser> {
    return this.afStore.collection<IUser>(environment.endpoints.users,
      ref => ref.where('uid', '==', uid))
      .snapshotChanges()
      .pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IUser;
        const id = a.payload.doc.id;
        return { id, ...data };
      })))
      .pipe(map(users => users[0]));
  }

  public UserCollectionExist(): Promise<Boolean> {
    /*const p = new Promise<Boolean>((resolve => {
      this.afStore.collection(environment.endpoints.users).doc(this.authService.currentUser.uid).get().toPromise().then((doc) => {
        if (doc.exists) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    }));

    return p;*/

    return this.afStore.collection(environment.endpoints.users).doc(this.authService.currentUserId)
      .get()
      .pipe(map(user => user.exists))
      .toPromise<boolean>();
  }

  public getNewUserInit(phone: string): IUser {
    const user: IUser = {
      nickname: null,
      pictureUrl: null,
      email: null,
      createdAt: Date.now.toString(),
      phone: phone,
      uid: this.authService.currentUserId
    };
    return user;
  }

  public GetCurrentIUser(): Observable<IUser> {
    return this.afStore.collection(environment.endpoints.users).doc(this.authService.user.uid).get()
      .pipe(map(doc => doc.data() as IUser));
  }

  public AddUser(user: IUser) {
    this.afStore.collection(environment.endpoints.users).doc(user.uid).set({
      ...user
    });
  }

  public UpdateUser(user: IUser) {
    this.afStore.collection(environment.endpoints.users).doc(user.uid).update({
      ...user
    });
  }

  public get GetCurrentFriends$(): Observable<IUser[]> {
    return this.CurrentUser$.pipe(
      switchMap((user) => {
        const userDocs = user.friends.map(f => this.User$(f.id));
        const combined = combineLatest(userDocs);
        return combined;
      })
    );
  }

  public sendProfileImg(file: string) {
    // this.afStore.
  }

  public addFriend(uid: string) {
    this.CurrentUser$.pipe(
      tap((user: IUser) => {
        this.afStore.collection(environment.endpoints.users).doc(uid)
          .get().pipe(
            tap((friend) => {
              user.friends.push(friend.ref);
              this.UpdateUser(user);
            })).subscribe();
      })
    ).subscribe();

    // .then(() => {
    //   this.UpdateUser(me);
    // });
  }

  public deleteFriend(uid: string) { }

  // TODO Where nickname is not him self
  public getOtherUserByNickName(nickname: string): Observable<IUser[]> {
    return this.afStore.collection<IUser>(environment.endpoints.users, ref =>
      ref.where('nickname', '==', nickname))
      .valueChanges();
  }


}
