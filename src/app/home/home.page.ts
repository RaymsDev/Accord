import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  User: firebase.UserInfo;
  constructor(private authService: AuthService) {
    this.authService.User$.subscribe(user => {
      this.User = user;
    });
  }
}
