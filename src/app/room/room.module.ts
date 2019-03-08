import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TimeStampToDatePipe } from '../pipes/time-stamp-to-date.pipe';
import { IonicModule } from '@ionic/angular';
import { RoomPage } from './room.page';

const routes: Routes = [
  {
    path: '',
    component: RoomPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [RoomPage, TimeStampToDatePipe]
})
export class RoomPageModule {}
