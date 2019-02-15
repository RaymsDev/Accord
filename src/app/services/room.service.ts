import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { IRoom } from '../models/IRoom';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private roomCollection: AngularFirestoreCollection<IRoom>;
  public Rooms$: Observable<IRoom[]>;
  constructor(
    private afStore: AngularFirestore
  ) {
    this.roomCollection = this.afStore.collection<IRoom>(environment.endpoints.rooms);
    this.Rooms$ = this.roomCollection.stateChanges(['added']).pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IRoom;
        const id = a.payload.doc.id;
        return { id, ...data };
      })));

  }

  getRoom(id) {
    return this.roomCollection.doc<IRoom>(id)
      .valueChanges();
  }
}
