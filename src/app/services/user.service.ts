import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore/firestore';
import { AngularFirestoreCollection } from '@angular/fire/firestore/collection/collection';
import { IUser } from '../models/IUser';
import { environment } from 'src/environments/environment.prod';
import { map, take, switchMap, mergeMap, flatMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { isBuffer } from 'util';
import { InnerSubscriber } from 'rxjs/internal/InnerSubscriber';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userCollection: AngularFirestoreCollection<IUser>;

  constructor(private authService: AuthService, private afStore: AngularFirestore) {
    this.userCollection = this.afStore.collection<IUser>(environment.endpoints.users);
  }

  public CurrentUser$(): Observable<IUser> {
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

  public getNewUserInit(): IUser {
    const user: IUser = {
      nickname: null,
      pictureUrl: null,
      email: null,
      createdAt: Date.now.toString(),
      uid: this.authService.currentUserId
    };
    return user;
  }

  public GetUserCurrentUser(): Observable<IUser> {
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
}
