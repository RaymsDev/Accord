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
    private router: Router,
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
  // Returns current user UID
  get currentUserId(): string {
    return this.authenticated ? this.user.uid : '';
  }

  VerifyPhone(num) {
    return this.firebaseAuth.VerifyPhoneAndroid(num);
  }

  SignInWithVerificationId(verificationId: string) {
    return this.firebaseAuth.SignInWithVerificationIdAndroid(
      verificationId,
      '12345'
    );
  }

  Logout() {
    this.firebaseAuth.SignOut();
    this.router.navigate(['/']);
  }

  CheckUserInfoAndRedirect(userId) {
    this.afStore
      .collection(environment.endpoints.users)
      .doc(userId)
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
