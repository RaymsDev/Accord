import { IMessage } from './IMessage';

export interface IRoom {
    id?: string;
    name: string;
    icon: string;
    messages: IMessage[];
}
