import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseAuthenticationService } from './firebase-authentication.service';
import { LocalStorageService } from './local-storage.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user$: Observable<firebase.UserInfo>;

  constructor(
    private firebaseAuth: FirebaseAuthenticationService,
    private afStore: AngularFirestore,
    private localStorage: LocalStorageService
  ) {
    this.user$ = this.firebaseAuth.Auth$;
  }

  public get IsAuthenticated(): boolean {
    return !!this.localStorage.Uid;
  }

  public get User$() {
    return this.user$;
  }
  public get CurrentUserId(): string {
    return this.localStorage.Uid;
  }

  public VerifyPhoneAndroid(phone: string) {
    return this.firebaseAuth.VerifyPhoneAndroid(phone);
  }

  public VerifyPhone(phone: string, recaptcha: any) {
    return this.firebaseAuth.VerifyPhoneWeb(phone, recaptcha);
  }

  public SignInWithVerificationIdAndroid(verificationId: string, code: any) {
    return this.firebaseAuth.SignInWithVerificationIdAndroid(
      verificationId,
      code
    );
  }

  public Logout() {
    return this.firebaseAuth.SignOut();
  }

  public GetUserDoc(userId) {
    return this.afStore
      .collection(environment.endpoints.users)
      .doc(userId)
      .get()
      .toPromise();
  }
}
