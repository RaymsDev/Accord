import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { IRoom } from 'src/app/models/IRoom';
import { RoomService } from 'src/app/services/room.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { IUser } from 'src/app/models/IUser';
import { ISelectable } from 'src/app/models/ISelectable';
import { map, mergeMap } from 'rxjs/operators';
import { Selectable } from 'src/app/models/Selectable';
import { Observable } from 'rxjs';

const initialRoom: IRoom = {
  icon: 'chatboxes',
  name: '',
  messages: [],
  ownerId: null
};

@Component({
  selector: 'app-edit-room',
  templateUrl: './edit-room.page.html',
  styleUrls: ['./edit-room.page.scss']
})
export class EditRoomPage implements OnInit {
  public Form: FormGroup;
  private room: IRoom = initialRoom;

  public SelectableFriends: ISelectable<IUser>[];
  constructor(
    private roomService: RoomService,
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initFriends();
    this.initForm();
  }

  private initFriends() {
    this.userService.GetCurrentFriends$.pipe(
      map(friends => {
        return friends.map(
          f =>
            new Selectable({
              Item: f
            })
        );
      })
    ).subscribe(selectableFriends => {
      this.SelectableFriends = selectableFriends;
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
    const newRoom = this.Form.value as IRoom;
    newRoom.ownerId = this.authService.currentUserId;
    const invitedFriends = this.SelectableFriends.filter(
      sf => sf.IsSelected
    ).map(sf => sf.Item);
    const sub = this.roomService
      .CreateRoom(newRoom, invitedFriends)
      .subscribe(createdRoom => {
        this.Form.setValue(initialRoom);
        this.router.navigate(['room', createdRoom.id]);
        sub.unsubscribe();
      });
  }
}
