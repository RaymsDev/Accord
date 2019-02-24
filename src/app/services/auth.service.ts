import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth/auth';
import { Observable, from } from 'rxjs';

import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: firebase.User;
  userObservable: Observable<firebase.User>;

  constructor(private firebaseAuth: AngularFireAuth, private toastCtrl: ToastController, private router: Router) {
    firebaseAuth.authState.subscribe((auth) => this.user = auth);
    this.userObservable = firebaseAuth.authState;
  }

  get authenticated(): boolean {
    return this.user !== null;
  }

  get User(): Observable<firebase.User> {
    return this.userObservable;
  }

  get currentUser(): any {
    return this.authenticated ? this.user : null;
  }

  // Returns current user UID
  get currentUserId(): string {
    return this.authenticated ? this.user.uid : '';
  }

  loginAnonimous() {
    this.firebaseAuth.auth.signInAnonymously().then(async _ => {
      (await this.toastCtrl.create({
        message: 'You well connect',
        color: 'success',
        duration: 2000
      })).present();
    }).catch(async err => {
      (await this.toastCtrl.create({
        message: 'Auth Fail',
        color: 'danger',
        duration: 2000
      })).present();
    });
  }

  signup_mail_psw(email: string, password: string) {
    this.firebaseAuth
      .auth
      .createUserWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Success!', value);
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });
  }

  login_mail_psw(email: string, password: string) {
    this.firebaseAuth
      .auth
      .signInWithEmailAndPassword(email, password)
      .then(value => {
        console.log('Nice, it worked!');
      })
      .catch(err => {
        console.log('Something went wrong:', err.message);
      });
  }

  send_phone_code(num, appVerifier): Observable<any> {
    return from(this.firebaseAuth.auth.signInWithPhoneNumber(num, appVerifier));
  }

  verify_phone_code(windowsRef, verificationCode) {
    // Check code
    windowsRef.confirmationResult
      .confirm(verificationCode)
      .then(result => {
        console.log(result, 'Well done you are in ! :)');
        this.router.navigate(['/']);
      })
      .catch(error => console.log(error, 'Incorrect code entered!'));

    // Root to homepage if success
  }

  logout() {
    this.firebaseAuth
      .auth
      .signOut();
  }

}
