import { DocumentReference } from '@angular/fire/firestore';

export interface IUser {
  id?: string;
  uid: string;
  email: string;
  nickname: string;
  pictureUrl: string;
  createdAt: string;
  friends: DocumentReference[];
}
