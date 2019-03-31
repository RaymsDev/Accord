import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseAuthenticationService } from './firebase-authentication.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: firebase.User;
  userObservable: Observable<firebase.User>;

  constructor(
    private firebaseAuth: FirebaseAuthenticationService,
    private afStore: AngularFirestore
  ) {
    this.firebaseAuth.Auth$.subscribe(user => {
      this.user = user;
    });
    this.userObservable = this.firebaseAuth.Auth$;
  }

  get authenticated(): boolean {
    return this.user !== null && this.user !== undefined;
  }

  get User(): Observable<firebase.User> {
    return this.userObservable;
  }
  get currentUserId(): string {
    return this.authenticated ? this.user.uid : '';
  }

  VerifyPhoneAndroid(phone: string) {
    return this.firebaseAuth.VerifyPhoneAndroid(phone);
  }

  VerifyPhone(phone: string, recaptcha: any) {
    return this.firebaseAuth.VerifyPhoneWeb(phone, recaptcha);
  }

  SignInWithVerificationIdAndroid(verificationId: string, code: any) {
    return this.firebaseAuth.SignInWithVerificationIdAndroid(
      verificationId,
      code
    );
  }

  Logout() {
    return this.firebaseAuth.SignOut();
  }

  CheckUserInfoAndRedirect(userId) {
    return this.afStore
      .collection(environment.endpoints.users)
      .doc(this.user.uid)
      .get()
      .toPromise();
  }
}
