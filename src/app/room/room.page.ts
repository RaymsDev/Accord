import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoomService } from '../services/room.service';
import { Observable } from 'rxjs';
import { IRoom } from '../models/IRoom';

@Component({
  selector: 'app-room',
  templateUrl: './room.page.html',
  styleUrls: ['./room.page.scss'],
})
export class RoomPage implements OnInit {

  public Room$: Observable<IRoom>;
  public NewMessage: string;

  constructor(private route: ActivatedRoute,
    private roomService: RoomService) { }

  ngOnInit() {
    this.initRoom();
  }

  private initRoom() {
    const roomId = this.route.snapshot.paramMap.get('id');
    this.Room$ = this.roomService.getRoom(roomId);
  }

}
