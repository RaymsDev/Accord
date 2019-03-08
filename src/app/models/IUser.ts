import { reference } from '@angular/core/src/render3';

export interface IUser {
    id?: string;
    uid: string;
    email: string;
    nickname: string;
    pictureUrl: string;
    createdAt: string;
    friends?: string[];
}
