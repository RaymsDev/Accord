import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { IRoom } from 'src/app/models/IRoom';
import { RoomService } from 'src/app/services/room.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { IUser } from 'src/app/models/IUser';
import { ISelectable } from 'src/app/models/ISelectable';
import { map, concatMap } from 'rxjs/operators';
import { Selectable } from 'src/app/models/Selectable';
import { Observable, forkJoin, Subscription } from 'rxjs';
import { ToastController } from '@ionic/angular';

const initialRoom: IRoom = {
  icon: 'chatboxes',
  name: '',
  messages: [],
  ownerId: null,
  memberIdList: []
};

@Component({
  selector: 'app-edit-room',
  templateUrl: './edit-room.page.html',
  styleUrls: ['./edit-room.page.scss']
})
export class EditRoomPage implements OnInit {
  public Form: FormGroup;
  private roomId: string;
  private room: IRoom = initialRoom;
  public IsEditMode = false;
  public SelectableUserList: ISelectable<IUser>[];
  constructor(
    private roomService: RoomService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.roomId = this.route.snapshot.paramMap.get('id');
    this.initForm();
    this.IsEditMode = this.roomId ? true : false;
    if (this.IsEditMode) {
      this.roomService.GetRoom$(this.roomId).subscribe(room => {
        this.room = room;
        this.Form.patchValue({
          name: room.name
        });
        this.initSelectableUserList(room);
      });
    } else {
      this.initSelectableUserList();
    }
  }

  public initSelectableUserList(room: IRoom = null) {
    this.getUserSelectable()
      .pipe(
        map(users => {
          return users.map(
            u =>
              new Selectable({
                Item: u,
                IsSelected: room
                  ? room.memberIdList.some(id => id === u.id)
                  : false
              })
          );
        })
      )
      .subscribe(selectableUserList => {
        this.SelectableUserList = selectableUserList;
      });
  }

  private getUserSelectable(): Observable<IUser[]> {
    if (this.IsEditMode) {
      return this.userService
        .GetUsers(this.room.memberIdList)
        .pipe(
          concatMap(
            () => this.userService.GetCurrentFriends$,
            (members, friends) => [...members, ...friends]
          )
        )
        .pipe(
          map(users => {
            return this.removeDuplicates(users);
          })
        )
        .pipe(
          map(users => {
            // We don't want current user our list
            return users.filter(u => u.id !== this.authService.user.uid);
          })
        );
    }
    return this.userService.GetCurrentFriends$;
  }

  private removeDuplicates(myArr: IUser[]) {
    return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj.id).indexOf(obj.id) === pos;
    });
  }
  private initForm() {
    const formObj = {};

    for (const prop of Object.keys(this.room)) {
      formObj[prop] = new FormControl(this.room[prop]);
    }

    this.Form = new FormGroup(formObj);
  }

  public OnSubmit() {
    if (this.IsEditMode) {
      this.editRoom();
      return;
    }

    this.createRoom();
  }
  private editRoom() {
    this.roomService
      .EditRoom(this.room.id, {
        name: this.Form.value.name,
        memberIdList: this.createMemberIdList()
      })
      .subscribe(() => {
        this.presentToast();
      });
  }

  private async presentToast() {
    const toast = await this.toastController.create({
      message: 'Room Updated !',
      duration: 2000
    });
    toast.present();
  }

  private createMemberIdList() {
    const memberIdList = this.SelectableUserList.filter(
      sf => sf.IsSelected
    ).map(sf => sf.Item.id);
    memberIdList.push(this.authService.currentUserId);
    return memberIdList;
  }

  private createRoom() {
    const newRoom = this.Form.value as IRoom;
    newRoom.ownerId = this.authService.currentUserId;
    newRoom.memberIdList = this.createMemberIdList();
    const sub = this.roomService.CreateRoom(newRoom).subscribe(createdRoom => {
      this.Form.setValue(initialRoom);
      this.router.navigate(['room', createdRoom.id]);
      sub.unsubscribe();
    });
  }
}
