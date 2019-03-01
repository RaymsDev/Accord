import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { RoomService } from './services/room.service';
import { AuthService } from './services/auth.service';

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

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private roomService: RoomService,
    private authService: AuthService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initRooms();
    });
  }

  initRooms() {
    this.roomService.Rooms$.subscribe(rooms => {
      this.appPages = pages;
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

  logout() {
    this.authService.logout();
  }
}
