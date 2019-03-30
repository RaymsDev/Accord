import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { auth } from 'firebase';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {
  private isAndroid: boolean;
  public Phone: string;
  public Verification: string;
  public Captcha: any;
  constructor(private authService: AuthService, private platform: Platform) {}

  ngOnInit() {
    this.isAndroid = this.platform.is('cordova') && this.platform.is('android');
    if (!this.isAndroid) {
      this.initCaptcha();
    }
  }

  private initCaptcha() {
    this.Captcha = new auth.RecaptchaVerifier('recaptcha-container');
    this.Captcha.render();
  }

  Send() {
    if (this.isAndroid) {
      this.authService
        .VerifyPhone(this.Phone)
        .then(verficationId => {
          return this.authService.SignInWithVerificationId(verficationId);
        })
        .then(userInfo => {
          const { uid } = userInfo;
          return this.authService.CheckUserInfoAndRedirect(uid);
        });
    } else {
    }
  }

  VerifyCode() {}
}
