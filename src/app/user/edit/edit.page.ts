import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { IUser } from 'src/app/models/IUser';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ToastController, Platform } from '@ionic/angular';
import { switchMap, mergeMap } from 'rxjs/operators';
import { from, of } from 'rxjs';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss']
})
export class EditPage implements OnInit {
  User: IUser;
  IsNewUser: boolean;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.userService
      .GetCurrentUser$()
      .pipe(
        switchMap(exist => {
          if (exist) {
            this.IsNewUser = false;
            return this.userService.GetCurrentUser$();
          }
          this.IsNewUser = true;
          return of(this.userService.NewUser);
        })
      )
      .subscribe(
        user => {
          this.User = user;
        },
        error => {
          console.error(error);
        },
        () => {
          console.log('complete');
        }
      );
  }

  public async OnClickUpdateInfo() {
    try {
      if (this.IsNewUser) {
        await this.userService.AddUser(this.User);
        this.router.navigate(['/']);
      } else {
        await this.userService.UpdateUser(this.User);
        this.showUpdateToast();
      }
    } catch (error) {
      console.error(error);
      this.showErrorToast();
    }
  }

  private async showErrorToast() {
    const toast = await this.toastController.create({
      color: 'danger',
      message: 'Error : Try later...',
      duration: 3000
    });
    toast.present();
  }
  private async showUpdateToast() {
    const toast = await this.toastController.create({
      color: 'secondary',
      message: 'Profile Updated',
      duration: 3000
    });
    toast.present();
  }

  public OnClickLogout() {
    this.authService.Logout().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
