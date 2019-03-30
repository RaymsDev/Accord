import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FriendPage } from './friend.page';

import { HttpClientModule } from '@angular/common/http';
import { UserItemComponent } from '../components/user-item/user-item.component';
import { UserItemModule } from '../components/user-item/user-item.module';

const routes: Routes = [
  {
    path: '',
    component: FriendPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    HttpClientModule,
    UserItemModule
  ],
  providers: [],
  declarations: [
    FriendPage,
    UserItemComponent
  ]
})
export class FriendPageModule { }
