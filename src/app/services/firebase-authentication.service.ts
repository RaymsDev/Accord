import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthenticationService {
  public get Auth$(): Observable<firebase.User> {
    return this.auth$;
  }
  public set Auth$(v: Observable<firebase.User>) {
    this.auth$ = v;
  }

  constructor(
    private platform: Platform,
    private webAuth: AngularFireAuth,
    private nativeAuth: FirebaseAuthentication
  ) {
    this.isAndroid = this.platform.is('cordova') && this.platform.is('android');
    if (this.isAndroid) {
      this.initAndroid();
    } else {
      this.initWeb();
    }
  }
  private isAndroid: boolean;

  private auth$: Observable<firebase.User>;

  private async initAndroid() {
    await this.platform.ready();
    this.Auth$ = this.nativeAuth.onAuthStateChanged();
  }

  private initWeb() {
    this.Auth$ = this.webAuth.authState;
  }

  SignInWithVerificationIdAndroid(verificationId: string, code: any) {
    return this.nativeAuth.signInWithVerificationId(verificationId, code);
  }

  VerifyPhoneAndroid(phoneNumber) {
    return this.nativeAuth.verifyPhoneNumber(phoneNumber, 120);
  }

  VerifyPhoneWeb(phoneNumber, recaptcha) {
    return this.webAuth.auth.signInWithPhoneNumber(phoneNumber, recaptcha);
  }

  SignOut(): Promise<void> {
    if (this.isAndroid) {
      return this.nativeAuth.signOut();
    } else {
      return this.webAuth.auth.signOut();
    }
  }
}
