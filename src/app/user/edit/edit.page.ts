import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { IUser } from 'src/app/models/IUser';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss']
})
export class EditPage implements OnInit {
  user: IUser;
  newUser: boolean;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.UserCollectionExist().then(exist => {
      if (exist) {
        this.userService.GetCurrentUser().subscribe(user => (this.user = user));
        this.newUser = false;
      } else {
        this.newUser = true;
        this.user = this.userService.getNewUserInit();
      }
    });
  }

  updateInfo() {
    this.newUser
      ? this.userService.AddUser(this.user)
      : this.userService.UpdateUser(this.user);
  }
}
