import { Component } from '@angular/core';

import { AuthService } from './services/auth.service';
import { Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { RoomService } from './services/room.service';
import { Firebase } from '@ionic-native/firebase/ngx';
import { User } from 'firebase';
import { UserService } from './services/user.service';

const pages = [
  {
    title: 'Home',
    url: '/home',
    icon: 'home'
  }
];

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public appPages = pages;
  public User = null;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private roomService: RoomService,
    private userService: UserService,
    private firebase: Firebase,
    private toaster: ToastController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.userService.CurrentUser$.subscribe(user => {
        this.User = user;
      });
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initRooms();
    });
  }

  initRooms() {
    this.roomService.HasMember$.subscribe(rooms => {
      this.appPages = [...pages];
      rooms
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach(r => {
          this.appPages.push({
            title: r.name,
            url: '/room/' + r.id,
            icon: r.icon
          });
        });
    });
  }
}
