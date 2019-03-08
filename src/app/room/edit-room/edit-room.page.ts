import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { IRoom } from 'src/app/models/IRoom';
import { RoomService } from 'src/app/services/room.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

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
  private room: IRoom = initialRoom;
  constructor(
    private roomService: RoomService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    const formObj = {};

    for (const prop of Object.keys(this.room)) {
      formObj[prop] = new FormControl(this.room[prop]);
    }

    this.Form = new FormGroup(formObj);
  }

  public async OnSubmit() {
    const newRoom = this.Form.value as IRoom;
    newRoom.ownerId = this.authService.currentUserId;
    const createdRoom = await this.roomService.CreateRoom(newRoom);
    this.Form.setValue(initialRoom);
    this.router.navigate(['room', createdRoom.id]);
  }
}
