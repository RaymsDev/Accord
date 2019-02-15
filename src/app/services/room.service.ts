import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { IRoom } from '../models/IRoom';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private roomCollection: AngularFirestoreCollection<IRoom>;
  public Rooms: Observable<IRoom[]>;
  constructor(
    private afStore: AngularFirestore
  ) {
    this.roomCollection = this.afStore.collection(environment.endpoints.rooms);
    this.Rooms = this.roomCollection.valueChanges();
  }

  getRoom(id) {
    return this.roomCollection.doc<IRoom>(id)
      .valueChanges();
  }
}
