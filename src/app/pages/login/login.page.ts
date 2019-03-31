import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { auth } from 'firebase';
import { Platform, AlertController, ToastController } from '@ionic/angular';
import {
  ValidatorFn,
  AbstractControl,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { AlertOptions } from '@ionic/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit, AfterViewInit {
  constructor(
    private authService: AuthService,
    private platform: Platform,
    private alertController: AlertController,
    private toastController: ToastController,
    private router: Router
  ) {}
  public IsAndroid: boolean;
  public Verification: string;
  public Captcha: auth.RecaptchaVerifier;
  public PhoneForm: FormGroup;

  private alertOptions: AlertOptions = {
    header: 'Phone Validation',
    message: 'Type Verification Code Here',
    translucent: true,
    inputs: [
      {
        name: 'code',
        type: 'number',
        placeholder: 'Code'
      }
    ],
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary'
      }
    ]
  };
  ngAfterViewInit(): void {
    if (!this.IsAndroid) {
      this.initCaptcha();
    }
  }

  ngOnInit() {
    this.IsAndroid = this.platform.is('cordova') && this.platform.is('android');
    this.initForm();
  }
  private initForm() {
    this.PhoneForm = new FormGroup({
      phone: new FormControl('', [Validators.required, this.phoneValidator()])
    });
  }

  private initCaptcha() {
    this.Captcha = new auth.RecaptchaVerifier('recaptcha-container');
    this.Captcha.render();
  }

  async VerifyPhone() {
    if (this.IsAndroid) {
      const verificationId = await this.authService.VerifyPhoneAndroid(
        this.PhoneForm.get('phone').value
      );
      this.promptCodeAndroid(verificationId);
    } else {
      const confirmationResult = await this.authService.VerifyPhone(
        this.PhoneForm.get('phone').value,
        this.Captcha
      );
      this.promptCodeWeb(confirmationResult);
    }
  }

  private async promptCodeWeb(confirmationResult: auth.ConfirmationResult) {
    const alertOption = {
      ...this.alertOptions
    };
    alertOption.buttons.push({
      text: 'Check',
      cssClass: 'secondary',
      handler: data => {
        this.checkCodeWeb(data.code, confirmationResult);
      }
    });
    const alert = await this.alertController.create(alertOption);
    await alert.present();
  }
  private async promptCodeAndroid(verificationId: string) {
    const alertOption = {
      ...this.alertOptions
    };
    alertOption.buttons.push({
      text: 'Check',
      cssClass: 'secondary',
      handler: data => {
        this.checkCodeAndroid(data.code, verificationId);
      }
    });
    const alert = await this.alertController.create(alertOption);
    await alert.present();
  }

  checkCodeWeb(code: string, confirmationResult: auth.ConfirmationResult) {
    confirmationResult
      .confirm(code)
      .then(result => {
        if (result && result.user) {
          return this.authService.CheckUserInfoAndRedirect(result.user.uid);
        }
      })
      .then(userData => {
        if (userData.exists) {
          this.router.navigate(['/']);
        } else {
          this.router.navigate(['/user/edit']);
        }
      })
      .catch(error => {
        this.showToastError();
      });
  }
  checkCodeAndroid(code: string, verificationId: string) {
    this.authService
      .SignInWithVerificationIdAndroid(verificationId, code)
      .then(result => {
        if (result) {
          return this.authService.CheckUserInfoAndRedirect(result.uid);
        }
      })
      .then(userData => {
        if (userData.exists) {
          this.router.navigate(['/']);
        } else {
          this.router.navigate(['/user/edit']);
        }
      })
      .catch(error => this.showToastError());
  }

  private async showToastError() {
    const toast = await this.toastController.create({
      color: 'danger',
      duration: 3000,
      message: 'Incorrect code typed'
    });

    toast.present();
  }

  private phoneValidator() {
    const validator: ValidatorFn = (phoneNumber: AbstractControl) => {
      const phoneRegex = /^((\+)33)[1-9](\d{2}){4}$/g;
      return phoneRegex.test(phoneNumber.value) ? null : { pattern: false };
    };
    return validator;
  }
}
