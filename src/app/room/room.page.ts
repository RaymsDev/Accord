import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  AfterContentChecked
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IRoom } from '../models/IRoom';
import { RoomService } from '../services/room.service';
import { Observable } from 'rxjs/internal/Observable';
import { IMessage } from '../models/IMessage';
import { UserService } from '../services/user.service';
import { IUser } from '../models/IUser';
import { ActionSheetController, Platform } from '@ionic/angular';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-room',
  templateUrl: './room.page.html',
  styleUrls: ['./room.page.scss']
})
export class RoomPage implements OnInit {
  @ViewChild('content') content;
  public CurrentUser: IUser;
  public Room$: Observable<IRoom>;
  public newMessage: string;
  private roomId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roomService: RoomService,
    private userService: UserService,
    private actionSheetController: ActionSheetController,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.platform.ready().then(() => {
      this.initRoom();
      this.initCurrentUser();
    });
  }

  ionViewDidEnter() {
    this.ScrollToBottom();
  }

  private initCurrentUser() {
    this.userService.GetCurrentUser$().subscribe(authUser => {
      this.CurrentUser = authUser;
    });
  }

  private initRoom() {
    this.roomId = this.route.snapshot.paramMap.get('id');
    this.Room$ = this.roomService.JoinUser(this.roomId);
  }

  public ScrollToBottom() {
    if (this.content) {
      this.content.scrollToBottom(300);
    }
  }

  public SendMessage(roomId: string) {
    this.roomService.SendMessage(this.CurrentUser, roomId, this.newMessage);
    this.newMessage = '';
  }

  public TrackByCreatedAt(i, message: IMessage) {
    return message.createdAt;
  }

  public async OnMoreButtonClick() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Room Actions',
      buttons: [
        {
          text: 'Edit',
          icon: 'create',
          handler: () => {
            this.router.navigate(['room', 'edit', this.roomId]);
          }
        },
        {
          text: 'Delete',
          role: 'destructive',
          icon: 'trash',
          handler: async () => {
            await this.roomService.Remove(this.roomId);
            this.router.navigate(['/']);
          }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            actionSheet.dismiss();
          }
        }
      ]
    });
    await actionSheet.present();
  }
}
