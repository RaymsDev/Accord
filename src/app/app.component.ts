import { Component, DoCheck } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { RoomService } from './services/room.service';
import { UserService } from './services/user.service';
import { IUser } from './models/IUser';
import { Subscription } from 'rxjs';

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
export class AppComponent implements DoCheck {
  public appPages = pages;
  public User: IUser = null;
  private userSubscription: Subscription;
  private roomSubscription: Subscription;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private roomService: RoomService,
    private userService: UserService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.watchUser();

      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.watchRooms();
    });
  }

  ngDoCheck() {
    // Dirty
    if (this.userSubscription && this.userSubscription.closed) {
      this.watchUser();
    }

    if (this.roomSubscription && this.roomSubscription.closed) {
      this.watchRooms();
    }
  }

  private watchUser() {
    this.userSubscription = this.userService
      .GetCurrentUser$()
      .subscribe(user => {
        this.User = user;
      });
  }
  private watchRooms() {
    this.roomSubscription = this.roomService.HasMember$.subscribe(rooms => {
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
