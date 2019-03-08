import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { IRoom } from '../models/IRoom';
import { RoomService } from '../services/room.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.page.html',
  styleUrls: ['./create-room.page.scss']
})
export class CreateRoomPage implements OnInit {
  public Form: FormGroup;
  private room: IRoom = {
    icon: 'chatboxes',
    name: '',
    messages: [],
    ownerId: null
  };
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
    this.router.navigate(['room', createdRoom.id]);
  }
}
