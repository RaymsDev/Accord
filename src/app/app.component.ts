import { Component } from '@angular/core';

import { Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { RoomService } from './services/room.service';
import { Firebase } from '@ionic-native/firebase/ngx';

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
    private firebase: Firebase,
    private toaster: ToastController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.initNotifications();
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

  private initNotifications() {
    if (this.platform.is('mobile')) {
      this.firebase.subscribe('all');

      this.firebase.onNotificationOpen()
        .subscribe(async response => {
          if (response.tap) {

          } else {
            const toast = await this.toaster.create({
              message: response.body,
              duration: 3000
            });

            toast.present();
          }
        });
    }
  }
}
