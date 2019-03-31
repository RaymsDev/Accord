import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { IUser } from 'src/app/models/IUser';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

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
    private router: Router
  ) {}

  ngOnInit() {
    this.userService.UserCollectionExist().then(exist => {
      if (exist) {
        this.userService.GetCurrentUser().subscribe(user => (this.User = user));
        this.IsNewUser = false;
      } else {
        this.IsNewUser = true;
        this.User = this.userService.getNewUserInit();
      }
    });
  }

  OnClickUpdateInfo() {
    if (this.IsNewUser) {
      this.userService.AddUser(this.User).then(() => {
        this.router.navigate(['/']);
      });
    } else {
      this.userService.UpdateUser(this.User);
    }
  }

  OnClickLogout() {
    this.authService.Logout().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
