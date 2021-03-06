import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore/firestore';
import { environment } from 'src/environments/environment';
import { IRoom } from '../models/IRoom';
import { Observable, of, combineLatest, from, observable } from 'rxjs';
import { map, switchMap, mergeMap, combineAll } from 'rxjs/operators';
import { firestore } from 'firebase';
import { IMessage } from '../models/IMessage';
import { AngularFirestoreCollection } from '@angular/fire/firestore/collection/collection';
import { UserService } from './user.service';
import { IUser } from '../models/IUser';
import { AuthService } from './auth.service';
import { endpoints } from 'src/environments/endpoints';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private roomCollection: AngularFirestoreCollection<Partial<IRoom>>;
  public Rooms$: Observable<IRoom[]>;
  constructor(
    private afStore: AngularFirestore,
    private userService: UserService,
    private platform: Platform
  ) {
    this.platform.ready().then(() => {
      this.roomCollection = this.afStore.collection<IRoom>(
        environment.endpoints.rooms
      );
      this.Rooms$ = this.roomCollection.stateChanges(['added']).pipe(
        map(actions =>
          actions.map(a => {
            const data = a.payload.doc.data() as IRoom;
            const id = a.payload.doc.id;
            return { id, ...data };
          })
        )
      );
    });
  }

  public GetRoom$(roomId): Observable<IRoom> {
    return this.roomCollection
      .doc<IRoom>(roomId)
      .snapshotChanges()
      .pipe(
        map(a => {
          const data = a.payload.data() as IRoom;
          const id = a.payload.id;
          return { id, ...data };
        })
      );
  }

  async SendMessage(currentUser: IUser, roomId: string, content) {
    const data: IMessage = {
      userId: currentUser.uid,
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
    return this.GetRoom$(roomId).pipe(
      switchMap(r => {
        // Unique User IDs
        room = r;
        // Set => unique item array
        const userIdList = r.messages
          ? Array.from(new Set(r.messages.map(m => m.userId)))
          : [];
        // Firestore User Doc Reads
        const userDocs = userIdList.map(userId =>
          this.userService.User$(userId)
        );
        const combined = combineLatest(userDocs);
        return userDocs.length ? combined : of([]);
      }),
      map(users => {
        users.forEach(user => {
          if (user) {
            joinKeys[user.uid] = user;
          }
        });
        room.messages = room.messages
          ? room.messages.map(m => {
              return { ...m, user: joinKeys[m.userId] };
            })
          : [];

        return room;
      })
    );
  }

  get Owned$(): Observable<IRoom[]> {
    return this.userService.GetCurrentUser$().pipe(
      switchMap(user => {
        if (!user) {
          return of([]);
        }
        return this.afStore
          .collection<IRoom>(environment.endpoints.rooms, ref =>
            ref.where('ownerId', '==', user.uid)
          )
          .snapshotChanges()
          .pipe(
            map(actions =>
              actions.map(a => {
                const data = a.payload.doc.data() as IRoom;
                const id = a.payload.doc.id;
                return { id, ...data };
              })
            )
          );
      })
    );
  }

  get HasMember$(): Observable<IRoom[]> {
    return this.userService.GetCurrentUser$().pipe(
      switchMap(user => {
        if (!user) {
          return of([]);
        }
        return this.afStore
          .collection<IRoom>(environment.endpoints.rooms, ref =>
            ref.where('memberIdList', 'array-contains', user.uid)
          )
          .snapshotChanges()
          .pipe(
            map(actions =>
              actions.map(a => {
                const data = a.payload.doc.data() as IRoom;
                const id = a.payload.doc.id;
                return { id, ...data };
              })
            )
          );
      })
    );
  }

  Remove(id: string) {
    this.roomCollection.doc(id).delete();
  }

  EditRoom(roomId: string, room: Partial<IRoom>) {
    return from(this.roomCollection.doc(roomId).update(room));
  }
  CreateRoom(room: IRoom) {
    return from(this.roomCollection.add(room));
  }
}
