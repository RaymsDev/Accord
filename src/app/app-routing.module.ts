import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './services/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'list',
    loadChildren: './list/list.module#ListPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    loadChildren: './user/login/login.module#LoginPageModule'
  },
  {
    path: 'room/:id',
    loadChildren: './room/room.module#RoomPageModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'user/edit',
    loadChildren: './user/edit/edit.module#EditPageModule',
    canActivate: [AuthGuard]
  },  { path: 'friend', loadChildren: './friend/friend.module#FriendPageModule' }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
