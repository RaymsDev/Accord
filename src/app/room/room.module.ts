import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TimeStampToDatePipe } from '../pipes/time-stamp-to-date.pipe';
import { IonicModule } from '@ionic/angular';
import { RoomPage } from './room.page';
import { EditRoomPage } from './edit-room/edit-room.page';
import { UserItemComponent } from '../components/user-item/user-item.component';
import { MarkdownToHtmlPipe } from '../pipes/markdown-to-html.pipe';
import { UserItemModule } from '../components/user-item/user-item.module';

import { MessageComponent } from '../components/message/message.component';
const routes: Routes = [
  {
    path: '',
    component: EditRoomPage
  },
  {
    path: 'edit/:id',
    component: EditRoomPage
  },
  {
    path: ':id',
    component: RoomPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    UserItemModule
  ],
  declarations: [
    MessageComponent,
    RoomPage,
    EditRoomPage,
    TimeStampToDatePipe,
    MarkdownToHtmlPipe
  ]
})
export class RoomPageModule {}
