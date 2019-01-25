import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';

import { ToastController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: Observable<firebase.User>;

  constructor(private firebaseAuth: AngularFireAuth, private toastCtrl: ToastController) {
    this.user = firebaseAuth.authState;
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


  logout() {
    this.firebaseAuth
      .auth
      .signOut();
  }

}
