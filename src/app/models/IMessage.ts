import { IUser } from './IUser';

export interface IMessage {
  id?: string;
  userId: string;
  content: string;
  createdAt: number;
  user?: IUser;
}
