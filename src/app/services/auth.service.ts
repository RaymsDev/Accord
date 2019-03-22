import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth/auth';
import { Observable, from } from 'rxjs';

import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { async } from 'q';
import { UserService } from './user.service';
import { IUser } from '../models/IUser';
import { environment } from 'src/environments/environment.prod';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: firebase.User;
  userObservable: Observable<firebase.User>;
  authObservable: Observable<firebase.auth.Auth>;

  constructor(
    private firebaseAuth: AngularFireAuth,
    private toastCtrl: ToastController,
    private router: Router,
    private afStore: AngularFirestore
  ) {
    this.firebaseAuth.authState.subscribe(auth => {
      this.user = auth;
    });
    this.userObservable = firebaseAuth.authState;
  }

  get authenticated(): boolean {
    return this.user !== null && this.user !== undefined;
  }

  get User(): Observable<firebase.User> {
    return this.userObservable;
  }

  get currentUser(): any {
    return this.authenticated ? this.user : null;
  }

  get currentUserObservable(): any {
    return this.firebaseAuth.authState;
  }

  // Returns current user UID
  get currentUserId(): string {
    return this.authenticated ? this.user.uid : '';
  }

  send_phone_code(num, appVerifier): Observable<any> {
    return from(this.firebaseAuth.auth.signInWithPhoneNumber(num, appVerifier));
  }

  async verify_phone_code(windowsRef, verificationCode) {
    await windowsRef.confirmationResult
      .confirm(verificationCode)
      .then(async result => {
        (await this.toastCtrl.create({
          message: 'Welcome',
          color: 'success',
          duration: 1500
        })).present();
        this.checkUserInfoAndRedirect();
      })
      .catch(async error => {
        (await this.toastCtrl.create({
          message: 'Welcome',
          color: 'danger',
          duration: 1500
        })).present();
      });
  }

  logout() {
    this.firebaseAuth.auth.signOut();
    this.router.navigate(['/']);
  }

  checkUserInfoAndRedirect() {
    this.afStore
      .collection(environment.endpoints.users)
      .doc(this.user.uid)
      .get()
      .toPromise()
      .then(userData => {
        if (userData.exists) {
          this.router.navigate(['/']);
        } else {
          this.router.navigate(['/user/edit']);
        }
      });
  }
}
