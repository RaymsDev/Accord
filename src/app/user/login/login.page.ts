import { Component, OnInit, ViewChild } from '@angular/core';
import { PhoneNumber } from 'src/app/models/PhoneNumber';
import { WindowService } from 'src/app/services/window.service';
import * as firebase from 'firebase';
import { AuthService } from 'src/app/services/auth.service';
import { ToastController } from '@ionic/angular';
import { async } from 'q';
import { SignupComponent } from '../signup/signup.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  windowRef: any;

  // TODO when verify disable field and hide capchat
  // TODO invisible capchat
  phoneNumber = new PhoneNumber();

  verificationCode: string;

  user: any;
  @ViewChild(SignupComponent) signup;

  constructor(private win: WindowService, private authService: AuthService,
    private _toastCtrl: ToastController) { }

  ngOnInit() {
    this.windowRef = this.win.windowRef;
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');

    this.windowRef.recaptchaVerifier.render();
    this.authService.User.subscribe((user) => this.user = user);
  }


  sendLoginCode() {

    const appVerifier = this.windowRef.recaptchaVerifier;

    const num = this.phoneNumber.e164;

    this.authService.send_phone_code(num, appVerifier).subscribe(
      (result) => {
        this.windowRef.confirmationResult = result;
      }, async error => {
        (await this._toastCtrl.create({
          message: 'Error append:' + error.message,
          color: 'danger',
          duration: 2000
        })).present();
      });
  }

  verifyLoginCode() {
    this.authService.verify_phone_code(this.windowRef, this.verificationCode, this.phoneNumber.e164);
  }

  logoutplz() {
    this.authService.logout();
  }

  showPseudo() {
    console.log('User pseudo' + this.signup.pseudo);
  }


}
