import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { Subject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthenticationService {
  public get Auth$(): Subject<firebase.User> {
    return this.auth$;
  }
  public set Auth$(v: Subject<firebase.User>) {
    this.auth$ = v;
  }

  constructor(
    private platform: Platform,
    private webAuth: AngularFireAuth,
    private nativeAuth: FirebaseAuthentication
  ) {
    this.isAndroid = this.platform.is('cordova') && this.platform.is('android');
    this.Auth$ = new Subject<firebase.User>();
    if (this.isAndroid) {
      this.initAndroid();
    } else {
      this.initWeb();
    }
  }
  private isAndroid: boolean;

  private auth$: Subject<firebase.User>;

  private async initAndroid() {
    await this.platform.ready();
    this.nativeAuth.onAuthStateChanged().subscribe(
      state => {
        this.Auth$.next(state);
      },
      error => {
        this.Auth$.error(error);
      }
    );
  }

  private initWeb() {
    this.webAuth.authState.subscribe(
      state => {
        this.Auth$.next(state);
      },
      error => {
        this.Auth$.error(error);
      }
    );
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
