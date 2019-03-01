import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth/auth';
import { Observable, from } from 'rxjs';

import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { async } from 'q';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: firebase.User;
  userObservable: Observable<firebase.User>;
  authObservable: Observable<firebase.auth.Auth>;

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

  send_phone_code(num, appVerifier): Observable<any> {
    return from(this.firebaseAuth.auth.signInWithPhoneNumber(num, appVerifier));
  }

  async verify_phone_code(windowsRef, verificationCode) {
    // Check code
    await windowsRef.confirmationResult
      .confirm(verificationCode)
      .then(result => {
        // TODO Add toaster
        console.log(result, 'Well done you are in ! :)');
        this.router.navigate(['/']);
      })
      // TODO Add toaster
      .catch(error => console.log(error, 'Incorrect code entered!'));

    // Root to homepage if success
  }

  verify_phone_code_with_set_pseudo(windowRef, verificationCode, pseudo) {
    this.verify_phone_code(windowRef, verificationCode).then(() => {
      console.log('Update profile');
      this.firebaseAuth.auth.currentUser.updateProfile({
        displayName: pseudo,
        photoURL: null
      }).then(() => {
        console.log('Display name set in angular :P');
      }).catch((error) => {
        console.log('Error display name not set');
      });
    });
  }

  logout() {
    this.firebaseAuth
      .auth
      .signOut();
  }

  // updateDisplayName()

}
