import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  user: firebase.User;
  constructor(private authService: AuthService) {
    authService.User.subscribe((user) => this.user = user);
  }
}
