import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore/firestore';
import { environment } from 'src/environments/environment';
import { IRoom } from '../models/IRoom';
import { Observable, of, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { firestore } from 'firebase';
import { IMessage } from '../models/IMessage';
import { AngularFirestoreCollection } from '@angular/fire/firestore/collection/collection';
import { UserService } from './user.service';
import { IUser } from '../models/IUser';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private roomCollection: AngularFirestoreCollection<IRoom>;
  public Rooms$: Observable<IRoom[]>;
  constructor(
    private afStore: AngularFirestore,
    private userService: UserService
  ) {
    this.roomCollection = this.afStore.collection<IRoom>(environment.endpoints.rooms);
    this.Rooms$ = this.roomCollection.stateChanges(['added']).pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as IRoom;
        const id = a.payload.doc.id;
        return { id, ...data };
      })));

  }

  private getRoom(roomId): Observable<IRoom> {
    return this.roomCollection.doc<IRoom>(roomId).snapshotChanges().pipe(
      map(a => {
        const data = a.payload.data() as IRoom;
        const id = a.payload.id;
        return { id, ...data };
      }));
  }

  async SendMessage(currentUser: IUser, roomId: string, content) {

    const data: IMessage = {
      userId: currentUser.id,
      content,
      createdAt: Date.now()
    };


    const ref = this.roomCollection.doc(roomId);
    return ref.update({
      messages: firestore.FieldValue.arrayUnion(data)
    });


  }

  JoinUser(roomId: string) {
    let room: IRoom;
    const joinKeys = {};
    return this.getRoom(roomId).pipe(
      switchMap(r => {
        // Unique User IDs
        room = r;
        // Set => unique item array
        const userIdList = r.messages ? Array.from(new Set(r.messages.map(m => m.userId))) : [];
        // Firestore User Doc Reads
        const userDocs = userIdList.map(userId =>
          this.userService.User$(userId)
        );
        const combined = combineLatest(userDocs);
        return userDocs.length ? combined : of([]);
      }),
      map((users) => {
        users.forEach(user => {
          if (user) {
            joinKeys[user.id] = user;
          }
        });
        room.messages = room.messages ? room.messages.map(m => {
          return { ...m, user: joinKeys[m.userId] };
        }) : [];

        return room;
      })
    );
  }
}
