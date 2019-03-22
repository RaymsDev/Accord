import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { IUser } from 'src/app/models/IUser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {

  user: IUser;
  newUser: boolean;

  constructor(private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.userService.UserCollectionExist().then((exist) => {
      if (exist) {
        this.userService.GetCurrentIUser().subscribe((user) => this.user = user);
        this.newUser = false;
      } else {
        this.newUser = true;
        const phone = this.route.snapshot.paramMap.get('phoneNumber');
        this.user = this.userService.getNewUserInit(phone);
      }
    });
  }

  updateInfo() {
    this.newUser ? this.userService.AddUser(this.user) : this.userService.UpdateUser(this.user);
  }
}
